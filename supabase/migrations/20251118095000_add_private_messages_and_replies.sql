-- Add columns for private messages and replies
ALTER TABLE public.messages
ADD COLUMN is_private BOOLEAN DEFAULT FALSE,
ADD COLUMN visible_to_users UUID[] DEFAULT '{}',
ADD COLUMN reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_messages_visible_to_users ON public.messages USING GIN(visible_to_users);
CREATE INDEX idx_messages_reply_to_id ON public.messages(reply_to_id);

-- Update RLS policy for messages to include private message visibility
DROP POLICY IF EXISTS "Users can view all messages" ON public.messages;

CREATE POLICY "Users can view messages"
  ON public.messages FOR SELECT
  USING (
    -- Public messages (not private)
    NOT is_private 
    OR 
    -- Private messages where user is in visible_to_users array
    (is_private AND auth.uid() = ANY(visible_to_users))
    OR
    -- User's own messages
    auth.uid() = user_id
  );
