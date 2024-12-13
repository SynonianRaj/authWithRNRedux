
import json
import base64
import os
import asyncio
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import ChatMessage, ChatRoom
from .utils import generate_unique_filename, get_file_extension


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Fetch and send chat history
        print("Initial Messages -> ")
        messages = await self.get_chat_history()
        print(messages)
        await self.send_json({
            "type": "connection_established",
            "data": {"status": "connected", "messages": messages}
        })

    async def disconnect(self, close_code):
        # Leave room group
        print("Connection lost -> ", close_code)
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive_json(self, content):
        print("Data Received -> ", content)
        message_type = content.get('message_type')
        message_content = content.get('content')
        sender_id = content.get('sender_id')
        receiver_id = content.get('receiver_id')
        timestamp = content.get('timestamp')
        duration = content.get('duration')

        if message_type not in ['text', 'image', 'audio', 'video']:
            await self.send_json({"type": "error", "data": {"message": "Invalid message type"}})
            return

        if message_type == 'text':
            await self.save_message(sender_id, receiver_id, message_content, message_type, duration)
            response_content = message_content
        else:
            file_url = await self.save_file(message_content, message_type)
            await self.save_message(sender_id, receiver_id, file_url, message_type,duration)
            response_content = file_url

        # Broadcast the message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'type': message_type,
                    'content': response_content,
                    'sender_id': sender_id,
                    'receiver_id': receiver_id,
                    'timestamp': timestamp,
                    'duration':duration
                }
            }
        )

    async def chat_message(self, event):
        await self.send_json({"type": "new_message", "data": {"messages" : [event['message']]}})

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content, message_type,duration):
        sender = get_object_or_404(User, id=sender_id)
        receiver = get_object_or_404(User, id=receiver_id)
        room, _ = ChatRoom.objects.get_or_create(name=self.room_name)
        ChatMessage.objects.create(
            room=room,
            sender=sender,
            receiver=receiver,
            content=content,
            message_type=message_type,
            duration = duration
        )

    @database_sync_to_async
    def get_chat_history(self):
        room = ChatRoom.objects.filter(name=self.room_name).first()
        if not room:
            return []

        messages = ChatMessage.objects.filter(room=room).order_by('timestamp')
        return [
            {
                'type': message.message_type,
                'content': message.content,
                'sender_id': message.sender.id,
                'sender_name': f"{message.sender.first_name} {message.sender.last_name}",
                'receiver_id': message.receiver.id,
                'timestamp': str(message.timestamp),
                'duration': message.duration if message.message_type in ['audio', 'video'] else None
            }
            for message in messages
        ]

    async def save_file(self, base64_data, file_type):
        file_name = generate_unique_filename(file_type)
        file_extension = get_file_extension(file_type)
        relative_path = f"uploads/{file_type}s/{file_name}.{file_extension}"
        file_path = os.path.join(settings.MEDIA_ROOT, relative_path)

        # Ensure the directories exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Write the file asynchronously
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self._write_file, file_path, base64_data)

        # Construct the full URL
        scheme = self.scope.get("scheme", "http")
        headers = dict(self.scope.get("headers", {}))
        host = headers.get(b"host", b"localhost").decode("utf-8")
        return f"{scheme}://{host}{settings.MEDIA_URL}{relative_path}"

    @staticmethod
    def _write_file(file_path, base64_data):
        with open(file_path, "wb") as file:
            file.write(base64.b64decode(base64_data))















# import json
# import base64
# import os
# import asyncio
# from channels.generic.websocket import AsyncJsonWebsocketConsumer
# from channels.db import database_sync_to_async
# from django.contrib.auth.models import User
# from django.conf import settings
# from .models import ChatMessage, ChatRoom
# from django.shortcuts import get_object_or_404
# from .utils import generate_unique_filename, get_file_extension

# class ChatConsumer(AsyncJsonWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f"chat_{self.room_name}"

#         # Join room group
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()

#         # Fetch and send chat history
#         messages = await self.get_chat_history(self.room_name)
#         await self.send_json({
#             "type": "connection_established",
#             "data": {
#                 "status": "connected",
#                 "messages": messages
#             }
#         })

#     async def disconnect(self, close_code):
#         # Leave room group
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive_json(self, content):
#         print("Data Received -> ", content)
#         message_type = content.get('message_type')
#         message_content = content.get('content')
#         sender_id = content.get('sender_id')
#         receiver_id = content.get('receiver_id')
#         timestamp = content.get('timestamp')

#         if message_type not in ['text', 'image', 'audio', 'video']:
#             await self.send_json({
#                 "type": "error",
#                 "data": {
#                     "message": "Invalid message type"
#                 }
#             })
#             return

#         if message_type == 'text':
#             await self.save_message(sender_id, receiver_id, self.room_name, message_content, message_type)
#         else:
#             file_url = await self.save_file(message_content, message_type)
#             await self.save_message(sender_id, receiver_id, self.room_name, file_url, message_type)

#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': {
#                     'type': message_type,
#                     'content': message_content if message_type == 'text' else file_url,
#                     'sender_id': sender_id,
#                     'receiver_id': receiver_id,
#                     'timestamp': timestamp
#                 }
#             }
#         )

#     async def chat_message(self, event):
#         message = event['message']
#         await self.send_json({
#             "type": "new_message",
#             "data": message
#         })

#     @database_sync_to_async
#     def save_message(self, sender_id, receiver_id, room_name, content, message_type):
#         sender = User.objects.get(id=sender_id)
#         receiver = User.objects.get(id=receiver_id)
#         room, _ = ChatRoom.objects.get_or_create(name=room_name)
#         ChatMessage.objects.create(
#             room=room,
#             sender=sender,
#             receiver=receiver,
#             content=content,
#             message_type=message_type
#         )

#     @database_sync_to_async
#     def get_chat_history(self, room_name):
#         room = ChatRoom.objects.filter(name=room_name)
#         if room :
#             messages = ChatMessage.objects.filter(room=room_name).order_by('timestamp')
#             return [
#                 {
#                     'type': message.message_type,
#                     'content': message.content,
#                     'sender_id': message.sender.id,
#                     'sender_name': f"{message.sender.first_name} {message.sender.last_name}",
#                     'receiver_id': message.receiver.id,
#                     'timestamp': str(message.timestamp)
#                 }
#                 for message in messages
#             ] if messages else []
#         return []

#     async def save_file(self, base64_data, file_type):
#         file_name = generate_unique_filename(file_type)
#         file_extension = get_file_extension(file_type)
#         relative_path = f"uploads/{file_type}s/{file_name}.{file_extension}"
#         file_path = os.path.join(settings.MEDIA_ROOT, relative_path)

#         os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
#         loop = asyncio.get_event_loop()
#         await loop.run_in_executor(None, self._write_file, file_path, base64_data)

#         return settings.MEDIA_URL + relative_path

#     @staticmethod
#     def _write_file(file_path, base64_data):
#         with open(file_path, "wb") as file:
#             file.write(base64.b64decode(base64_data))

