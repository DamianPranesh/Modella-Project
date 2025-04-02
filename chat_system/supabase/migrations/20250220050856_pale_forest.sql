/*
  # Create messages table for real-time chat

  1. New Tables
    - `messages`
      - `id` (bigint, primary key)
      - `message` (text, required)
      - `sender` (text, required)
      - `created_at` (timestamp with time zone, default: now())

  2. Security
    - Enable RLS on `messages` table
    - Add policies for:
      - Anyone can read messages
      - Anyone can insert messages (public chat)
*/

CREATE TABLE IF NOT EXISTS messages (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message text NOT NULL,
  sender text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert messages
CREATE POLICY "Anyone can insert messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);