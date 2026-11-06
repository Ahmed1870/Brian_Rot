// manzooma_store_db — Lesson 60 dataset

/** Trigger timing types. */
export const TRIGGER_TIMINGS = [
  {type: 'BEFORE', color: '#38BDF8', desc: 'Validate & modify before write', icon: 'shield'},
  {type: 'AFTER', color: '#10B981', desc: 'Log & audit after commit', icon: 'check'},
  {type: 'INSTEAD OF', color: '#A855F7', desc: 'Route DML to views', icon: 'arrow'},
];

/** Magic variables. */
export const MAGIC_VARS = [
  {name: 'NEW', color: '#38BDF8', desc: 'Modified row values (INSERT/UPDATE)', scope: 'Post-modification state'},
  {name: 'OLD', color: '#F59E0B', desc: 'Pre-modification row values (UPDATE/DELETE)', scope: 'Pre-modification state'},
  {name: 'TG_OP', color: '#A855F7', desc: 'Operation type (INSERT/UPDATE/DELETE)', scope: 'Operation identifier'},
];

/** Enterprise audit trigger code. */
export const AUDIT_TRIGGER_CODE = [
  'CREATE FUNCTION fn_log_balance_change()',
  'RETURNS TRIGGER AS $$',
  'BEGIN',
  '  IF NEW.balance <> OLD.balance THEN',
  '    INSERT INTO audit_logs(customer_id, old_bal, new_bal, changed_at)',
  '    VALUES(NEW.customer_id, OLD.balance, NEW.balance, NOW());',
  '  END IF;',
  '  RETURN NEW;',
  'END; $$ LANGUAGE plpgsql;',
  'CREATE TRIGGER trg_audit_customer_changes',
  '  AFTER UPDATE ON store_customers',
  '  FOR EACH ROW EXECUTE FUNCTION fn_log_balance_change();',
];

/** Trigger function + binding code for Scene 3. */
export const TRIGGER_FN_CODE = [
  'CREATE FUNCTION fn_audit() RETURNS TRIGGER',
  'AS $$ BEGIN',
  '  -- Access NEW.column / OLD.column',
  '  RETURN NEW;',
  'END; $$ LANGUAGE plpgsql;',
  'CREATE TRIGGER trg_audit',
  '  BEFORE UPDATE ON store_customers',
  '  FOR EACH ROW EXECUTE FUNCTION fn_audit();',
];
