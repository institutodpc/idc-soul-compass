
-- Remove comment markers and ensure the calcular_perfis function is correctly defined
CREATE OR REPLACE FUNCTION public.calcular_perfis(user_uuid uuid)
RETURNS TABLE(profile_id integer, score_normalizado numeric)
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
    SELECT
      pw.profile_id,
      SUM(pw.weight * a.value)::NUMERIC
        / NULLIF(SUM(pw.weight * 3), 0) * 100
        AS score_normalizado
    FROM public.answers a
    JOIN public.profile_weights pw
      ON a.question_id = pw.question_id
    WHERE a.user_id = user_uuid
    GROUP BY pw.profile_id
    ORDER BY score_normalizado DESC
    LIMIT 3;
END;
$function$;
