-- Add session token for anonymous conversations
ALTER TABLE conversations 
ADD COLUMN session_token TEXT;

-- Create index for session token lookups
CREATE INDEX idx_conversations_session_token ON conversations(session_token) WHERE session_token IS NOT NULL;

-- Drop existing policies for conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;

-- Recreate policies with session token support
CREATE POLICY "Users can view their own conversations"
ON conversations
FOR SELECT
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND session_token = current_setting('request.headers', true)::json->>'x-session-token')
);

CREATE POLICY "Users can create conversations"
ON conversations
FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND session_token IS NOT NULL)
);

CREATE POLICY "Users can update their own conversations"
ON conversations
FOR UPDATE
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND session_token = current_setting('request.headers', true)::json->>'x-session-token')
);

CREATE POLICY "Users can delete their own conversations"
ON conversations
FOR DELETE
USING (
  auth.uid() = user_id OR
  (user_id IS NULL AND session_token = current_setting('request.headers', true)::json->>'x-session-token')
);

-- Update messages policies to check session tokens
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can create messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete messages in their conversations" ON messages;

CREATE POLICY "Users can view messages in their conversations"
ON messages
FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations 
    WHERE (user_id = auth.uid()) OR 
          (user_id IS NULL AND session_token = current_setting('request.headers', true)::json->>'x-session-token')
  )
);

CREATE POLICY "Users can create messages in their conversations"
ON messages
FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations 
    WHERE (user_id = auth.uid()) OR 
          (user_id IS NULL AND session_token = current_setting('request.headers', true)::json->>'x-session-token')
  )
);

CREATE POLICY "Users can update their own messages"
ON messages
FOR UPDATE
USING (
  conversation_id IN (
    SELECT id FROM conversations 
    WHERE (user_id = auth.uid()) OR
          (user_id IS NULL AND session_token = current_setting('request.headers', true)::json->>'x-session-token')
  )
);

CREATE POLICY "Users can delete messages in their conversations"
ON messages
FOR DELETE
USING (
  conversation_id IN (
    SELECT id FROM conversations 
    WHERE (user_id = auth.uid()) OR
          (user_id IS NULL AND session_token = current_setting('request.headers', true)::json->>'x-session-token')
  )
);

-- Update feedback policies
DROP POLICY IF EXISTS "Users can view feedback on their messages" ON feedback;

CREATE POLICY "Users can view feedback on their messages"
ON feedback
FOR SELECT
USING (
  message_id IN (
    SELECT m.id FROM messages m
    JOIN conversations c ON m.conversation_id = c.id
    WHERE (c.user_id = auth.uid()) OR
          (c.user_id IS NULL AND c.session_token = current_setting('request.headers', true)::json->>'x-session-token')
  )
);