import { FutureScopePage } from '@/components/admin/future/FutureScopePage';

export default function ChatPage() {
  return (
    <FutureScopePage
      title="Chat"
      version="V2"
      description="Conversation inspection for support investigations is planned for V2."
      plannedScope={[
        'Conversation list and detail view',
        'Participant and unread visibility',
        'Message history for support review',
      ]}
    />
  );
}
