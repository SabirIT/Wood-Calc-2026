/* =====================================================
   Wood Calculator - main script
   Sections: 1 Helpers | 2 Data | 3 Screen | 4 Calculate
             5 List | 6 Buttons | 7 Offline support
   ===================================================== */


/* ---------- 1. HELPERS ---------- */

// Short way to find an element by its id
const $ = (id) => document.getElementById(id);

// Normal rounding to 2 decimals (5.2163 -> 5.22). Used for Size Wood.
const roundNormal = (x) => Math.round((x + Number.EPSILON) * 100) / 100;

// Cut off after 2 decimals, never rounds up (5.2163 -> 5.21).
// Used for Log Wood and for list totals.
const cutTwo = (x) => Math.floor(x * 100 + 1e-6) / 100;


/* ---------- 2. DATA ---------- */

let type = 'size';   // current tab: 'size' or 'log'
let items = [];      // all saved entries (both types)

// Load saved entries from this phone
try {
  items = JSON.parse(localStorage.getItem('wc_items') || '[]');
} catch (e) {
  items = [];
}

// Save entries on this phone
function saveItems() {
  try {
    localStorage.setItem('wc_items', JSON.stringify(items));
  } catch (e) {}
}


/* ---------- 3. SCREEN (show the right tab) ---------- */

function setUI() {
  // Highlight the active tab
  $('t1').className = type === 'size' ? 'on' : '';
  $('t2').className = type === 'log' ? 'on' : '';

  // Show Size Wood inputs or Log Wood inputs
  const sizeDisplay = type === 'size' ? 'block' : 'none';
  $('a').style.display = sizeDisplay;
  $('b').style.display = sizeDisplay;
  $('c').style.display = sizeDisplay;
  $('lg').style.display = type === 'log' ? 'block' : 'none';

  render();     // show the list of this tab
  calculate();  // refresh the result box
}


/* ---------- 4. CALCULATE ---------- */

// Reads the inputs, shows the result, and returns the entry (or null if incomplete)
function calculate() {
  $('er').textContent = '';

  let volume = 0;
  let details = '';
  let valid = false;
  let measures = {};   // each measurement kept separately for the table

  if (type === 'size') {
    // SIZE WOOD: length (ft) x width (in) x thickness (in) / 144
    const length = parseFloat($('a1').value) || 0;
    const width = parseFloat($('b1').value) || 0;
    const thickness = parseFloat($('c1').value) || 0;

    valid = length > 0 && width > 0 && thickness > 0;
    volume = roundNormal(roundNormal(roundNormal(length * width) * thickness) / 144);
    details = `${length} ft × ${width} in × ${thickness} in`;
    measures = { len: length, wid: width, thk: thickness };
  } else {
    // LOG WOOD: roundness typed as ft.in (3.7 = 3 ft 7 in)
    const parts = $('l1').value.trim().split('.');
    const feet = parseInt(parts[0], 10) || 0;
    const inches = parseInt(parts[1], 10) || 0;
    const roundnessInch = feet * 12 + inches;   // 3.7 -> 43
    const length = parseFloat($('l2').value) || 0;

    valid = roundnessInch > 0 && length > 0;
    // roundness x roundness x length / 2304, cut off after 2 decimals
    volume = cutTwo(cutTwo(cutTwo(roundnessInch * roundnessInch) * length) / 2304);
    details = `Roundness ${$('l1').value || 0}, Length ${length}`;
    measures = { len: length, rnd: $('l1').value.trim() || '0' };
  }

  volume = cutTwo(volume);

  // Show result box
  $('res').innerHTML = valid
    ? `Volume<b>${volume.toFixed(2)} cft</b>`
    : 'Enter size to see volume<b>—</b>';

  // Entry format is kept the same as before (d, q, v, tot) so old saved lists still work
  return valid ? { type, d: details, q: 1, v: volume, tot: volume, ...measures } : null;
}


/* ---------- 5. LIST ---------- */

// Draws the list of the current tab as a table, its total, and the hidden PDF table
function render() {
  const isSize = type === 'size';

  // Column names for each wood type
  const headers = isSize
    ? ['Length (ft)', 'Width (in)', 'Thickness (in)']
    : ['Length (ft)', 'Roundness (ft.in)'];

  let rows = '';      // rows for the screen table
  let pdfRows = '';   // rows for the PDF table
  let total = 0;
  let count = 0;

  items.forEach((item, index) => {
    if (item.type !== type) return;   // show only the current tab's items

    count++;
    total = cutTwo(total + item.tot);

    // Measurement cells. Old saved entries have no separate values, so show their text instead.
    let cells;
    if (item.len === undefined) {
      cells = `<td colspan="${headers.length}">${item.d}</td>`;
    } else if (isSize) {
      cells = `<td>${item.len}</td><td>${item.wid}</td><td>${item.thk}</td>`;
    } else {
      cells = `<td>${item.len}</td><td>${item.rnd}</td>`;
    }

    const cft = item.tot.toFixed(2);
    rows += `<tr><td>${count}</td>${cells}<td class="v">${cft}</td><td><button data-i="${index}">×</button></td></tr>`;
    pdfRows += `<tr><td>${count}</td>${cells}<td>${cft}</td></tr>`;
  });

  const headCells = headers.map((h) => `<th>${h}</th>`).join('');
  const name = isSize ? 'Size Wood' : 'Log Wood';

  $('ls').innerHTML = count === 0
    ? '<div class="em">No items yet</div>'
    : `<table class="lt">
         <thead><tr><th>No.</th>${headCells}<th>cft</th><th></th></tr></thead>
         <tbody>${rows}</tbody>
       </table>`;

  $('tt').textContent = total.toFixed(2) + ' cft';
  $('lt').textContent = name + ' List';

  // Hidden table used only when saving as PDF
  $('pr').innerHTML = `
    <h2>Wood Calculator - ${name} List</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <table>
      <tr><th>No.</th>${headCells}<th>cft</th></tr>
      ${pdfRows}
      <tr><th colspan="${headers.length + 1}">Total</th><th>${total.toFixed(2)} cft</th></tr>
    </table>`;

  window.hasRows = count > 0;
}


/* ---------- 6. BUTTONS ---------- */

// Recalculate whenever the user types
document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', calculate);
});

// Tabs
$('t1').onclick = () => { type = 'size'; setUI(); };
$('t2').onclick = () => { type = 'log'; setUI(); };

// Calculate & Add to List
$('add').onclick = () => {
  const entry = calculate();

  if (!entry) {
    $('er').textContent = 'Please fill all sizes.';
    return;
  }

  items.push(entry);
  saveItems();
  render();

  // Clear the input boxes for the next entry
  ['a1', 'b1', 'c1', 'l1', 'l2'].forEach((id) => { $(id).value = ''; });
  calculate();
};

// Delete one entry (the x button)
$('ls').onclick = (e) => {
  const index = e.target.getAttribute('data-i');
  if (index !== null) {
    items.splice(Number(index), 1);
    saveItems();
    render();
  }
};

// Clear all entries of the current tab only
$('clr').onclick = () => {
  const hasItems = items.some((item) => item.type === type);
  if (hasItems && confirm('Clear this list?')) {
    items = items.filter((item) => item.type !== type);
    saveItems();
    render();
  }
};

// Save list as PDF (opens the phone's print screen -> choose "Save as PDF")
$('pdf').onclick = () => {
  if (!window.hasRows) {
    alert('List is empty');
    return;
  }
  const oldTitle = document.title;
  const today = new Date().toISOString().slice(0, 10);
  document.title = `wood-${type}-list-${today}`;   // becomes the PDF file name
  window.print();
  document.title = oldTitle;
};

// Start the app
setUI();


/* ---------- 7. OFFLINE SUPPORT ---------- */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}
