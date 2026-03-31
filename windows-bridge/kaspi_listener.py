import asyncio
import re
import requests
from winsdk.windows.foundation.metadata import ApiInformation
from winsdk.windows.ui.notifications.management import UserNotificationListener
from winsdk.windows.ui.notifications import NotificationKinds, KnownNotificationBindings

# ==========================================
# НАСТРОЙКИ
# ==========================================
# Замените этот URL на ваш реальный адрес сервера, если он изменится
WEBHOOK_URL = "https://ais-dev-7v5bpblcukaaazjp6lsptp-508989116566.asia-southeast1.run.app/api/webhooks/kaspi"

# Названия приложения, от которого ждем уведомления
APP_NAMES = ["Связь с телефоном", "Phone Link"]
# ==========================================

async def main():
    if not ApiInformation.is_type_present("Windows.UI.Notifications.Management.UserNotificationListener"):
        print("❌ Ваша система не поддерживает чтение уведомлений (нужна Windows 10 или 11).")
        return

    listener = UserNotificationListener.get_current()
    access_status = await listener.request_access_async()

    if access_status != 1: # 1 = Allowed
        print("❌ Нет доступа к уведомлениям Windows.")
        print("Перейдите в 'Параметры' -> 'Конфиденциальность и защита' -> 'Уведомления' и разрешите доступ для Python/Командной строки.")
        return

    print("✅ Слушатель уведомлений успешно запущен!")
    print("⏳ Ожидание переводов Kaspi через 'Связь с телефоном'...")
    print("-" * 50)
    
    # Храним ID уже обработанных уведомлений, чтобы не дублировать отправку
    processed_ids = set()

    while True:
        try:
            # Получаем все текущие уведомления (Toast)
            notifications = await listener.get_notifications_async(NotificationKinds.TOAST)
            
            for notif in notifications:
                notif_id = notif.id
                if notif_id in processed_ids:
                    continue
                    
                app_name = notif.app_info.display_info.display_name
                
                # Проверяем, что уведомление от нужного приложения
                if any(name in app_name for name in APP_NAMES):
                    
                    # Получаем текст уведомления
                    binding = notif.notification.visual.get_binding(KnownNotificationBindings.get_toast_generic())
                    if binding:
                        texts = [text.text for text in binding.get_text_elements()]
                        full_text = " | ".join(texts)
                        
                        # Ищем ключевые слова Kaspi
                        if "Kaspi.kz" in full_text or "поступление" in full_text.lower() or "перевод" in full_text.lower():
                            print(f"\n🔔 Новое уведомление: {full_text}")
                            
                            # Парсим текст уведомления
                            # Пример: "Kaspi.kz | Поступление 1 000 ₸ от Иван И. Сообщение: Привет стример! https://youtube.com/..."
                            
                            amount = 0
                            sender = "Аноним"
                            message = ""
                            
                            # 1. Извлекаем сумму (ищем цифры перед знаком ₸ или словом тенге)
                            amount_match = re.search(r'([\d\s]+)\s*(?:₸|тнг|тенге)', full_text, re.IGNORECASE)
                            if amount_match:
                                # Убираем пробелы из суммы (например "1 000" -> "1000")
                                amount = int(re.sub(r'\s+', '', amount_match.group(1)))
                                
                            # 2. Извлекаем отправителя (ищем "от Кого-то")
                            sender_match = re.search(r'от\s+([А-Яа-яA-Za-z\s\.]+)(?:\.|\s*Сообщение:|$)', full_text)
                            if sender_match:
                                sender = sender_match.group(1).strip()
                                
                            # 3. Извлекаем сообщение (ищем после слова "Сообщение:")
                            msg_match = re.search(r'Сообщение:\s*(.+)$', full_text, re.IGNORECASE)
                            if msg_match:
                                message = msg_match.group(1).strip()
                                
                            if amount > 0:
                                print(f"💰 Распознан донат: {amount} ₸ от {sender}")
                                if message:
                                    print(f"💬 Текст: {message}")
                                
                                # Отправляем на наш сервер (в виджеты)
                                payload = {
                                    "amount": amount,
                                    "sender": sender,
                                    "message": message
                                }
                                
                                try:
                                    response = requests.post(WEBHOOK_URL, json=payload, timeout=5)
                                    if response.status_code == 200:
                                        print("🚀 Успешно отправлено на виджет в OBS!")
                                    else:
                                        print(f"⚠️ Ошибка отправки на сервер: код {response.status_code}")
                                except Exception as e:
                                    print(f"❌ Ошибка соединения с сервером: {e}")
                            else:
                                print("⚠️ Не удалось распознать сумму перевода.")
                                    
                # Добавляем ID в обработанные
                processed_ids.add(notif_id)
                
            # Очищаем старые ID, чтобы память не текла
            if len(processed_ids) > 1000:
                processed_ids.clear()
                
        except Exception as e:
            print(f"Произошла ошибка при чтении уведомлений: {e}")
            
        # Проверяем новые уведомления каждые 2 секунды
        await asyncio.sleep(2)

if __name__ == "__main__":
    # Для Windows необходимо использовать ProactorEventLoop
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nПрограмма остановлена.")
