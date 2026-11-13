// Lesson 72 — Reading & Editing Core VBA Scripts
// Realistic VBA code snippets for refactoring demonstration.

// BLOATED recorded macro (before refactoring)
export const VBA_BLOATED = [
  {n: 1, code: 'Sub FormatReport()', color: 'kw'},
  {n: 2, code: "    ' Recorded macro - needs cleanup", color: 'comment'},
  {n: 3, code: '    Range("A1").Select', color: 'select', strike: true},
  {n: 4, code: '    Selection.Font.Bold = True', color: 'select', strike: true},
  {n: 5, code: '    Range("A1:E500").Select', color: 'select', strike: true},
  {n: 6, code: '    Selection.Interior.Color = RGB(16,124,65)', color: 'select', strike: true},
  {n: 7, code: '    Columns("A:E").Select', color: 'select', strike: true},
  {n: 8, code: '    Selection.ColumnWidth = 15', color: 'select', strike: true},
  {n: 9, code: 'End Sub', color: 'kw'},
];

// CLEAN refactored macro (after refactoring)
export const VBA_CLEAN = [
  {n: 1, code: 'Sub FormatReport()', color: 'kw'},
  {n: 2, code: "    ' Refactored - direct addressing", color: 'comment'},
  {n: 3, code: '    Range("A1").Font.Bold = True', color: 'clean'},
  {n: 4, code: '    Range("A1:E500").Interior.Color = RGB(16,124,65)', color: 'clean'},
  {n: 5, code: '    Columns("A:E").ColumnWidth = 15', color: 'clean'},
  {n: 6, code: 'End Sub', color: 'kw'},
];

// Dynamic LastRow + If + For Each (full enterprise script)
export const VBA_DYNAMIC = [
  {n: 1, code: 'Sub FormatSalesData()', color: 'kw'},
  {n: 2, code: "    ' Dynamic + Optimized VBA", color: 'comment'},
  {n: 3, code: '    Application.ScreenUpdating = False', color: 'perf'},
  {n: 4, code: '    Application.Calculation = xlCalculationManual', color: 'perf'},
  {n: 5, code: '    On Error GoTo SafeExit', color: 'error'},
  {n: 6, code: '    Dim LastRow As Long', color: 'dim'},
  {n: 7, code: '    LastRow = Cells(Rows.Count, 1).End(xlUp).Row', color: 'lastrow'},
  {n: 8, code: '    Dim cell As Range', color: 'dim'},
  {n: 9, code: '    For Each cell In Range("E2:E" & LastRow)', color: 'loop'},
  {n: 10, code: '        If cell.Value > 50000 Then', color: 'if'},
  {n: 11, code: '            cell.Interior.Color = RGB(239, 68, 68)', color: 'action'},
  {n: 12, code: '        End If', color: 'if'},
  {n: 13, code: '    Next cell', color: 'loop'},
  {n: 14, code: 'SafeExit:', color: 'error'},
  {n: 15, code: '    Application.Calculation = xlCalculationAutomatic', color: 'perf'},
  {n: 16, code: '    Application.ScreenUpdating = True', color: 'perf'},
  {n: 17, code: 'End Sub', color: 'kw'},
];

// Code color mapping
export const CODE_COLORS = {
  kw: '#38BDF8',        // keywords (Sub, End Sub, Dim, etc)
  comment: '#10B981',   // green comments
  select: '#EF4444',     // red - bloated .Select lines
  clean: '#10B981',     // green - clean direct addressing
  perf: '#F59E0B',      // amber - performance wrappers
  error: '#A855F7',    // purple - error handling
  dim: '#38BDF8',      // blue - declarations
  lastrow: '#A855F7',  // purple - dynamic LastRow
  loop: '#A855F7',     // purple - For Each loop
  if: '#A855F7',       // purple - conditional
  action: '#FBBF24',   // gold - actions inside if
};

export const VBE_NAV = ['Project Explorer', 'Modules', 'Module1', 'FormatReport'];

export const EXEC_STATS = [
  {l: 'الصفوف المعالجة', v: '50,000', s: 'rows', color: '#10B981'},
  {l: 'زمن التنفيذ', v: '1.8', s: 'ms', color: '#38BDF8'},
  {l: 'سطور .Select المحذوفة', v: '6', s: 'lines', color: '#EF4444'},
  {l: 'الأخطاء', v: '0', s: 'errors', color: '#A855F7'},
];
