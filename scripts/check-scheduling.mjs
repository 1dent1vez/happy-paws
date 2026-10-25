import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/components/HeroOmniBar.astro', import.meta.url), 'utf8');
const body = source.split('function refreshSelection() {')[1].split('\n    function pad(')[0];
const refresh = new Function('Date', 'state', `
  var { today, calYear, calMonth, selDate, selHour } = state;
  var MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  var valFecha = { textContent: '', classList: { add() {} } };
  var syncCta = () => {};
  function refreshSelection() { ${body}
  refreshSelection();
  return { today, calYear, calMonth, selDate, selHour, label: valFecha.textContent };
`);
function run(now, selection, calendar = [2026, 9]) {
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
  }
  return refresh(Clock, {
    today: new Date(2026, 9, 24), calYear: calendar[0], calMonth: calendar[1],
    selDate: selection.date, selHour: selection.hour,
  });
}

test('a selected hour that elapsed while the tab was idle is cleared', () => {
  const result = run(new Date(2026, 9, 24, 12, 5), {date: new Date(2026,9,24),hour:12});
  assert.equal(result.selHour,null);
  assert.equal(result.selDate.getDate(),24);
  assert.equal(result.label,'24 Octubre, 2026');
});
test('yesterday is cleared after midnight and the calendar advances across years', () => {
  const result = run(new Date(2027,0,1,1), {date:new Date(2026,11,31),hour:18},[2026,11]);
  assert.equal(result.selDate,null);
  assert.equal(result.selHour,null);
  assert.equal(result.calYear,2027);
  assert.equal(result.calMonth,0);
});
test('a future day keeps its early hour even when today has passed it', () => {
  const result=run(new Date(2026,9,24,19),{date:new Date(2026,9,26),hour:7});
  assert.equal(result.selHour,7);
  assert.equal(result.selDate.getDate(),26);
});
