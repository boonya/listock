create table "public"."items" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "title" text not null default ''::text,
    "price" numeric,
    "currency" text not null default ''::text,
    "date" timestamp with time zone,
    "is_completed" boolean not null default false,
    "list_id" uuid not null,
    "order" numeric
);


alter table "public"."items" enable row level security;

create table "public"."lists" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null default ''::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "owner_id" uuid default auth.uid()
);


alter table "public"."lists" enable row level security;

CREATE UNIQUE INDEX items_pkey ON public.items USING btree (id);

CREATE UNIQUE INDEX lists_pkey ON public.lists USING btree (id);

alter table "public"."items" add constraint "items_pkey" PRIMARY KEY using index "items_pkey";

alter table "public"."lists" add constraint "lists_pkey" PRIMARY KEY using index "lists_pkey";

alter table "public"."items" add constraint "items_list_id_fkey" FOREIGN KEY (list_id) REFERENCES lists(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."items" validate constraint "items_list_id_fkey";

alter table "public"."lists" add constraint "lists_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."lists" validate constraint "lists_owner_id_fkey";

grant delete on table "public"."items" to "anon";

grant insert on table "public"."items" to "anon";

grant references on table "public"."items" to "anon";

grant select on table "public"."items" to "anon";

grant trigger on table "public"."items" to "anon";

grant truncate on table "public"."items" to "anon";

grant update on table "public"."items" to "anon";

grant delete on table "public"."items" to "authenticated";

grant insert on table "public"."items" to "authenticated";

grant references on table "public"."items" to "authenticated";

grant select on table "public"."items" to "authenticated";

grant trigger on table "public"."items" to "authenticated";

grant truncate on table "public"."items" to "authenticated";

grant update on table "public"."items" to "authenticated";

grant delete on table "public"."items" to "service_role";

grant insert on table "public"."items" to "service_role";

grant references on table "public"."items" to "service_role";

grant select on table "public"."items" to "service_role";

grant trigger on table "public"."items" to "service_role";

grant truncate on table "public"."items" to "service_role";

grant update on table "public"."items" to "service_role";

grant delete on table "public"."lists" to "anon";

grant insert on table "public"."lists" to "anon";

grant references on table "public"."lists" to "anon";

grant select on table "public"."lists" to "anon";

grant trigger on table "public"."lists" to "anon";

grant truncate on table "public"."lists" to "anon";

grant update on table "public"."lists" to "anon";

grant delete on table "public"."lists" to "authenticated";

grant insert on table "public"."lists" to "authenticated";

grant references on table "public"."lists" to "authenticated";

grant select on table "public"."lists" to "authenticated";

grant trigger on table "public"."lists" to "authenticated";

grant truncate on table "public"."lists" to "authenticated";

grant update on table "public"."lists" to "authenticated";

grant delete on table "public"."lists" to "service_role";

grant insert on table "public"."lists" to "service_role";

grant references on table "public"."lists" to "service_role";

grant select on table "public"."lists" to "service_role";

grant trigger on table "public"."lists" to "service_role";

grant truncate on table "public"."lists" to "service_role";

grant update on table "public"."lists" to "service_role";

create policy "Enable delete for users their own data only"
on "public"."items"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT lists.owner_id
   FROM lists
  WHERE (lists.id = items.list_id))));


create policy "Enable insert for authenticated users only"
on "public"."items"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to update their own data only"
on "public"."items"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT lists.owner_id
   FROM lists
  WHERE (lists.id = items.list_id))));


create policy "Enable users to view their own data only"
on "public"."items"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT lists.owner_id
   FROM lists
  WHERE (lists.id = items.list_id))));


create policy "Enable insert for authenticated users only"
on "public"."lists"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to delete their own data only"
on "public"."lists"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Enable users to update their own data only"
on "public"."lists"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Enable users to view their own data only"
on "public"."lists"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id));

