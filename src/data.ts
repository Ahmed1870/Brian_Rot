// manzooma_store_db — Lesson 59 dataset

/** Function vs Procedure comparison data. */
export const FN_VS_PROC = [
  {
    type: 'CREATE FUNCTION',
    color: '#38BDF8',
    features: ['Must RETURN value', 'Callable in SELECT', 'No Tx Control'],
    callSyntax: 'SELECT fn_name(...);',
    txControl: false,
  },
  {
    type: 'CREATE PROCEDURE',
    color: '#A855F7',
    features: ['No return value', 'Called via CALL', 'Explicit COMMIT/ROLLBACK'],
    callSyntax: 'CALL sp_name(...);',
    txControl: true,
  },
];

/** PL/pgSQL code example for Scene 3. */
export const PLPGSQL_CODE = [
  'CREATE OR REPLACE FUNCTION fn_calc_tax(price NUMERIC)',
  'RETURNS NUMERIC AS $$',
  'DECLARE tax NUMERIC;',
  'BEGIN',
  '  tax := price * 0.14;',
  '  RETURN tax;',
  'END;',
  '$$ LANGUAGE plpgsql;',
];

/** Enterprise procedure code for Scene 5. */
export const ENTERPRISE_PROC_CODE = [
  'CREATE PROCEDURE sp_process_monthly_bonuses(p_rate NUMERIC)',
  'LANGUAGE plpgsql AS $$',
  'BEGIN',
  '  UPDATE store_customers',
  '  SET balance = balance * (1 + p_rate);',
  '  COMMIT;',
  'END; $$;',
  '-- Execute:',
  'CALL sp_process_monthly_bonuses(0.05);',
];
