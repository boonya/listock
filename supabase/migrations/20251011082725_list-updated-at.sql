CREATE OR REPLACE FUNCTION public.update_updated_at_column()
  RETURNS trigger
  LANGUAGE plpgsql
AS $function$
begin
  -- Only set updated_at to now() if it wasn't explicitly changed in the UPDATE
  IF NEW.updated_at = OLD.updated_at THEN
    NEW.updated_at = now();
  END IF;
  return NEW;
end;
$function$
;

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON public.lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
