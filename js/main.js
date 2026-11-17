// ============================================================
// PORCH & PINE PROPERTIES — MAIN JS
// ============================================================

// ---- MOBILE NAV ----
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ---- BUILD A PROPERTY CARD ----
function buildCard(listing) {
  const statusColors = { available: '#3D6B2C', pending: '#C49A5A', rented: '#999' };
  const statusLabels = { available: 'Available', pending: 'Application Pending', rented: 'Rented' };
  const placeholderHtml = `<div class="property-card-image-placeholder"><span>&#127968;</span><p>Photo Coming Soon</p></div>`;
  const imageHtml = listing.image
    ? `<img src="${listing.image}" alt="${listing.title}" class="property-card-image" onerror="this.onerror=null;this.outerHTML='<div class=\'property-card-image-placeholder\'><span>&#127968;</span><p>Photo Coming Soon</p></div>';" />`
    : placeholderHtml;

  const featuresHtml = listing.features && listing.features.length
    ? `<div class="property-card-meta">${listing.features.slice(0,4).map(f => `<span>&#10003; ${f}</span>`).join('')}</div>`
    : '';

  const statusBadge = listing.status !== 'available'
    ? `<div class="property-badge" style="background:${statusColors[listing.status]};color:#fff;position:absolute;top:12px;right:12px;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;">${statusLabels[listing.status]}</div>`
    : '';

  return `
    <div class="property-card" data-type="${listing.type}" data-beds="${Math.floor(listing.beds)}" data-state="${listing.state}">
      <div class="property-card-image-wrap">
        ${imageHtml}
        <div class="property-badge ${listing.type === 'long-term' ? 'badge-long-term' : 'badge-short-term'}">
          ${listing.type === 'long-term' ? 'Long-Term' : 'Short-Term'}
        </div>
        ${statusBadge}
      </div>
      <div class="property-card-body">
        <div class="property-card-price">$${listing.price.toLocaleString()}<span>${listing.priceLabel}</span></div>
        <div class="property-card-title">${listing.title}</div>
        <div class="property-card-location">&#128205; ${listing.address}</div>
        <div class="property-card-meta">
          <span>&#127968; ${listing.beds} Bed${listing.beds !== 1 ? 's' : ''}</span>
          ${listing.baths == null || listing.baths === '' ? `<span>&#128703; See listing</span>` : `<span>&#128703; ${listing.baths} Bath${listing.baths !== 1 ? 's' : ''}</span>`}
          ${listing.sqft ? `<span>&#9632; ${listing.sqft.toLocaleString()} sqft</span>` : ''}
        </div>
        ${featuresHtml}
        <p class="property-card-desc">${listing.description}</p>
        <div class="property-card-avail" style="font-size:0.8rem;color:#757575;margin-bottom:12px;">
          &#128197; Available: ${listing.availableDate}
        </div>
        <div class="property-card-footer">
          <a href="contact.html?property=${listing.id}" class="btn btn-primary">Inquire</a>
          ${listing.trulia ? `<a href="${listing.trulia}" target="_blank" rel="noopener" class="btn btn-trulia">Trulia</a>` : ''}
          ${listing.hotpads ? `<a href="${listing.hotpads}" target="_blank" rel="noopener" class="btn btn-hotpads">HotPads</a>` : ''}
          ${listing.zillow ? `<a href="${listing.zillow}" target="_blank" rel="noopener" class="btn btn-zillow">Zillow</a>` : ''}
          ${listing.airbnb ? `<a href="${listing.airbnb}" target="_blank" rel="noopener" class="btn btn-airbnb">Airbnb</a>` : ''}
        </div>
      </div>
    </div>
  `;
}

// ---- HOMEPAGE: FEATURED LISTINGS PREVIEW ----
const featuredGrid = document.getElementById('featuredListings');
if (featuredGrid && typeof LISTINGS !== 'undefined') {
  const availableFeatured = LISTINGS.filter(l => l.featured && l.status === 'available');
  const featured = [
    ...availableFeatured.filter(l => l.type === 'long-term'),
    ...availableFeatured.filter(l => l.type !== 'long-term')
  ].slice(0, 3);
  if (featured.length) {
    featuredGrid.innerHTML = featured.map(buildCard).join('');
  } else {
    featuredGrid.innerHTML = '<p style="text-align:center;color:#757575;">No listings available right now. <a href="contact.html" style="color:#3D6B2C;font-weight:600;">Contact us</a> to learn about upcoming properties.</p>';
  }
}

// ---- LISTINGS PAGE: FULL GRID + FILTERS ----
const listingsGrid  = document.getElementById('listingsGrid');
const listingsCount = document.getElementById('listingsCount');
const noResults     = document.getElementById('noResults');
const filterType    = document.getElementById('filterType');
const filterBeds    = document.getElementById('filterBeds');
const filterState   = document.getElementById('filterState');
const clearFilters  = document.getElementById('clearFilters');
const resetLink     = document.getElementById('resetLink');

function applyFilters() {
  if (!listingsGrid || typeof LISTINGS === 'undefined') return;

  const type  = filterType  ? filterType.value  : 'all';
  const beds  = filterBeds  ? filterBeds.value  : 'all';
  const state = filterState ? filterState.value : 'all';

  const filtered = LISTINGS.filter(l => {
    if (l.status === 'rented') return false;
    if (type  !== 'all' && l.type  !== type)                          return false;
    if (state !== 'all' && l.state !== state)                         return false;
    if (beds  !== 'all') {
      const b = parseInt(beds);
      if (beds === '4' && Math.floor(l.beds) < 4)                     return false;
      if (beds !== '4' && Math.floor(l.beds) !== b)                   return false;
    }
    return true;
  });

  listingsGrid.innerHTML = filtered.length ? filtered.map(buildCard).join('') : '';

  if (listingsCount) {
    listingsCount.textContent = `Showing ${filtered.length} propert${filtered.length === 1 ? 'y' : 'ies'}`;
  }
  if (noResults) {
    noResults.classList.toggle('hidden', filtered.length > 0);
  }
}

if (listingsGrid) {
  applyFilters();
  if (filterType)  filterType.addEventListener('change',  applyFilters);
  if (filterBeds)  filterBeds.addEventListener('change',  applyFilters);
  if (filterState) filterState.addEventListener('change', applyFilters);
  if (clearFilters) {
    clearFilters.addEventListener('click', () => {
      if (filterType)  filterType.value  = 'all';
      if (filterBeds)  filterBeds.value  = 'all';
      if (filterState) filterState.value = 'all';
      applyFilters();
    });
  }
  if (resetLink) {
    resetLink.addEventListener('click', e => {
      e.preventDefault();
      if (filterType)  filterType.value  = 'all';
      if (filterBeds)  filterBeds.value  = 'all';
      if (filterState) filterState.value = 'all';
      applyFilters();
    });
  }
}

// ---- CONTACT FORM ----
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

if (contactForm) {
  // Pre-fill property if coming from a listing inquiry
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get('property');
  if (propertyId && typeof LISTINGS !== 'undefined') {
    const prop = LISTINGS.find(l => l.id === parseInt(propertyId));
    if (prop) {
      const msgField = document.getElementById('message');
      if (msgField) msgField.value = `I am interested in: ${prop.title} (${prop.address})`;
    }
  }

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Basic validation
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) { field.style.borderColor = '#c0392b'; valid = false; }
      else field.style.borderColor = '';
    });
    if (!valid) return;

    // Show success (in production, you'd POST to a backend/Netlify form/Formspree here)
    contactForm.classList.add('hidden');
    if (formSuccess) formSuccess.classList.remove('hidden');
  });
}
