-- 1. الجداول الأساسية
create table users (
  id uuid references auth.users default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role text check (role in ('admin', 'teacher', 'student')) not null,
  phone text,
  country_code text default '+966',
  is_active boolean default true,
  created_at timestamp default now(),
  primary key (id)
);

create table agreements (
  id uuid default gen_random_uuid(),
  teacher_id uuid references users(id),
  student_id uuid references users(id),
  subject text not null,
  start_date date not null,
  end_date date,
  is_active boolean default true,
  created_by uuid references users(id),
  created_at timestamp default now(),
  primary key (id)
);

create table teacher_slots (
  id uuid default gen_random_uuid(),
  teacher_id uuid references users(id),
  day_of_week integer check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  subject text not null,
  created_at timestamp default now(),
  primary key (id)
);

create table sessions (
  id uuid default gen_random_uuid(),
  agreement_id uuid references agreements(id),
  teacher_id uuid references users(id),
  student_id uuid references users(id),
  scheduled_at timestamp not null,
  status text check (status in ('scheduled', 'active', 'completed', 'cancelled')) default 'scheduled',
  room_name text unique not null,
  started_at timestamp,
  ended_at timestamp,
  recording_url text,
  created_at timestamp default now(),
  primary key (id)
);

create table session_recordings (
  id uuid default gen_random_uuid(),
  session_id uuid references sessions(id),
  file_url text not null,
  uploaded_at timestamp default now(),
  duration_seconds integer,
  transcript_text text,
  analysis_result jsonb,
  alert_sent boolean default false,
  primary key (id)
);

create table assignments (
  id uuid default gen_random_uuid(),
  teacher_id uuid references users(id),
  agreement_id uuid references agreements(id),
  title text not null,
  description text,
  questions jsonb not null,
  due_date timestamp,
  is_exam boolean default false,
  exam_duration_minutes integer,
  created_at timestamp default now(),
  primary key (id)
);

create table submissions (
  id uuid default gen_random_uuid(),
  assignment_id uuid references assignments(id),
  student_id uuid references users(id),
  answers jsonb not null,
  score integer,
  submitted_at timestamp default now(),
  started_at timestamp,
  primary key (id)
);

create table ratings (
  id uuid default gen_random_uuid(),
  session_id uuid references sessions(id),
  student_id uuid references users(id),
  teacher_id uuid references users(id),
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamp default now(),
  primary key (id)
);

create table messages (
  id uuid default gen_random_uuid(),
  sender_id uuid references users(id),
  receiver_id uuid references users(id),
  content text,
  file_url text,
  created_at timestamp default now(),
  primary key (id)
);

create table banned_words (
  id uuid default gen_random_uuid(),
  word text not null,
  severity text default 'high',
  created_at timestamp default now(),
  primary key (id)
);

-- 2. RLS Policies
alter table users enable row level security;
alter table agreements enable row level security;
alter table sessions enable row level security;
alter table messages enable row level security;

create policy "Users access" on users
  for select using (
    auth.uid() = id or
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

create policy "Agreements access" on agreements
  for select using (
    teacher_id = auth.uid() or
    student_id = auth.uid() or
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

create policy "Sessions access" on sessions
  for all using (
    teacher_id = auth.uid() or
    student_id = auth.uid() or
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );
