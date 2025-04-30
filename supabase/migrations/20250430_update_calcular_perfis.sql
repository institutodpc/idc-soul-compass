
-- Enhanced version of calcular_perfis function that ensures balanced scoring
-- by normalizing profile scores based on questions answered
CREATE OR REPLACE FUNCTION public.calcular_perfis(user_uuid uuid)
RETURNS TABLE(profile_id integer, score_normalizado numeric, perfil_nome text, peso_total numeric)
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
    WITH user_answers AS (
      SELECT 
        a.question_id,
        a.value
      FROM public.answers a
      WHERE a.user_id = user_uuid
    ),
    profile_scores AS (
      SELECT
        pw.profile_id,
        p.nome as perfil_nome,
        SUM(pw.weight * ua.value) as raw_score,
        SUM(pw.weight * 3) as max_possible_score,
        COUNT(DISTINCT ua.question_id) as questions_answered
      FROM user_answers ua
      JOIN public.profile_weights pw ON ua.question_id = pw.question_id
      JOIN public.profiles p ON pw.profile_id = p.id
      GROUP BY pw.profile_id, p.nome
      HAVING COUNT(DISTINCT ua.question_id) > 0
    )
    SELECT
      ps.profile_id,
      (ps.raw_score / NULLIF(ps.max_possible_score, 0) * 100) AS score_normalizado,
      ps.perfil_nome,
      ps.max_possible_score / 3 as peso_total
    FROM profile_scores ps
    ORDER BY score_normalizado DESC
    LIMIT 3;
END;
$function$;

-- Add helper function to validate profile weight distribution
CREATE OR REPLACE FUNCTION public.validar_pesos_perfis()
RETURNS TABLE(profile_id integer, profile_name text, question_count bigint, total_weight numeric)
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
    SELECT
      p.id as profile_id,
      p.nome as profile_name,
      COUNT(DISTINCT pw.question_id) as question_count,
      SUM(pw.weight) as total_weight
    FROM public.profiles p
    LEFT JOIN public.profile_weights pw ON p.id = pw.profile_id
    GROUP BY p.id, p.nome
    ORDER BY p.id;
END;
$function$;
