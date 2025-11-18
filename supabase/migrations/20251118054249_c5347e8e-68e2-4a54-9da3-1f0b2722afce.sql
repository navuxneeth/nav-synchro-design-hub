-- Drop existing foreign key that references auth.users
ALTER TABLE public.tasks
DROP CONSTRAINT tasks_assignee_id_fkey;

-- Add correct foreign key that references profiles
ALTER TABLE public.tasks
ADD CONSTRAINT tasks_assignee_id_fkey
FOREIGN KEY (assignee_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;