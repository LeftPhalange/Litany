-- ============================================================
-- Litany – initial schema
-- ============================================================

-- ── Enum types ───────────────────────────────────────────────

create type task_priority as enum ('low', 'medium', 'high', 'none');
create type subtask_type  as enum ('manual', 'timed', 'none');
create type subtask_state as enum ('complete', 'incomplete');

-- ── Tasks ────────────────────────────────────────────────────

create table tasks (
    id               bigint        generated always as identity primary key,
    user_id          uuid          not null references auth.users (id) on delete cascade,
    title            text          not null check (char_length(title) between 1 and 64),
    task_description text          not null default '' check (char_length(task_description) <= 128),
    priority         task_priority not null default 'none',
    created_at       timestamptz   not null default now()
);

alter table tasks enable row level security;

create policy "users can select own tasks"
    on tasks for select
    using (auth.uid() = user_id);

create policy "users can insert own tasks"
    on tasks for insert
    with check (auth.uid() = user_id);

create policy "users can update own tasks"
    on tasks for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "users can delete own tasks"
    on tasks for delete
    using (auth.uid() = user_id);

-- ── Subtasks ─────────────────────────────────────────────────

create table subtasks (
    id                 bigint        generated always as identity primary key,
    parent_task_id     bigint        not null references tasks (id) on delete cascade,
    user_id            uuid          not null references auth.users (id) on delete cascade,
    title              text          not null check (char_length(title) between 1 and 64),
    type               subtask_type  not null default 'manual',
    state              subtask_state not null default 'incomplete',
    -- duration in seconds; -1 means not applicable (manual subtasks)
    duration           integer       not null default -1 check (duration = -1 or duration >= 1),
    row_position_index integer       not null default 0 check (row_position_index >= 0),
    created_at         timestamptz   not null default now()
);

alter table subtasks enable row level security;

create policy "users can select own subtasks"
    on subtasks for select
    using (auth.uid() = user_id);

create policy "users can insert own subtasks"
    on subtasks for insert
    with check (auth.uid() = user_id);

create policy "users can update own subtasks"
    on subtasks for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "users can delete own subtasks"
    on subtasks for delete
    using (auth.uid() = user_id);
