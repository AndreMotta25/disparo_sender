/*
  # Create users_juv table

  1. New Tables
    - `users_juv`
      - `id` (uuid, primary key): User's unique identifier
      - `name` (text): User's full name
      - `email` (text): User's email address (unique)
      - `unit` (text): The unit/location where the user works
      - `created_at` (timestamp): When the user was created
  
  2. Security
    - Enable RLS on `users_juv` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS users_juv (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users_juv ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data"
  ON users_juv
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users_juv
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON users_juv
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);