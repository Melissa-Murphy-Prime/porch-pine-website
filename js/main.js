// ============================================================
// PORCH & PINE PROPERTIES — MAIN JS
// ============================================================

// ---- MOVE-IN PROMO ----
(function () {
  const now = new Date();
  const stamp = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  if (stamp > 20261201) return;
  try {
    if (localStorage.getItem('ppPromoDismissed') === 'move-in-2026') return;
  } catch (err) {
    /* private mode */
  }
  const banner = document.createElement('div');
  banner.className = 'promo-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Move-in special');
  banner.innerHTML = '<a href="listings.html">Move-in special: 2 weeks off your first month on select homes. Sign a qualifying lease by Nov 30 with a start date by Dec 1.</a><button type="button" aria-label="Dismiss move-in special">&times;</button>';
  banner.querySelector('button').addEventListener('click', () => {
    banner.remove();
    try { localStorage.setItem('ppPromoDismissed', 'move-in-2026'); } catch (err) { /* ignore */ }
  });
  document.body.prepend(banner);
})();

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

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function listingAlt(listing) {
  const beds = `${listing.beds} bedroom${listing.beds === 1 ? '' : 's'}`;
  const baths = listing.baths == null || listing.baths === ''
    ? ''
    : `, ${listing.baths} bath${Number(listing.baths) === 1 ? '' : 's'}`;
  return `${beds}${baths} at ${listing.address}. ${listing.title}`;
}

function contactSubjectUrl(prefix, listing) {
  return `contact.html?subject=${encodeURIComponent(`${prefix} – ${listing.address}`)}`;
}

function externalListingButtons(listing) {
  const links = [
    ['trulia', 'Trulia', 'btn-trulia'],
    ['hotpads', 'HotPads', 'btn-hotpads'],
    ['zillow', 'Zillow', 'btn-zillow'],
    ['airbnb', 'Airbnb', 'btn-airbnb']
  ];
  return links
    .filter(([key]) => listing[key])
    .map(([key, label, cls]) => `<a href="${escapeHtml(listing[key])}" target="_blank" rel="noopener" class="btn ${cls}">${label}</a>`)
    .join('');
}

function longTermActionButtons(listing) {
  if (listing.type !== 'long-term') return '';
  return `
    <a href="${contactSubjectUrl('Rental application', listing)}" class="btn btn-primary">Apply Now</a>
    <a href="${contactSubjectUrl('Showing request', listing)}" class="btn btn-outline">Schedule a Showing</a>
    <a href="tel:+15098680709" class="btn btn-outline">Call (509) 868-0709</a>
  `;
}

const LISTING_IMAGE_SIZE = {
  'images/rentals/1107-w-27th.jpg': [960, 682],
  'images/rentals/2203-e-desmet.jpg': [960, 720],
  'images/rentals/3418-e-glass.jpg': [960, 720],
  'images/rentals/508-e-longfellow.jpg': [960, 720],
  'images/rentals/6117-n-ash.jpg': [960, 720],
  'images/rentals/621-e-33rd.jpg': [960, 720],
  'images/rentals/902-w-mansfield-1.jpg': [640, 480],
  'images/rentals/cda-lakefront-retreat.jpg': [960, 720],
  'images/rentals/pend-oreille-bay.jpg': [960, 640],
  'images/rentals/river-penthouse.jpg': [960, 642],
  'images/rentals/schweitzer-mountain.jpg': [960, 642],
  'images/rentals/windy-bay.jpg': [960, 720]
};

function listingImageHtml(listing, options = {}) {
  const placeholderHtml = `<div class="property-card-image-placeholder"><span>&#127968;</span><p>Photo Coming Soon</p></div>`;
  if (!listing.image) return placeholderHtml;
  const size = LISTING_IMAGE_SIZE[listing.image];
  const dimensions = size ? ` width="${size[0]}" height="${size[1]}"` : '';
  const loading = options.lazy === false
    ? ' loading="eager" fetchpriority="high"'
    : ' loading="lazy"';
  return `<img src="${escapeHtml(listing.image)}" alt="${escapeHtml(listingAlt(listing))}" class="property-card-image"${dimensions}${loading} decoding="async" onerror="this.onerror=null;this.outerHTML='<div class=\\'property-card-image-placeholder\\'><span>&#127968;</span><p>Photo Coming Soon</p></div>';" />`;
}

// ---- BUILD A PROPERTY CARD ----
function buildCard(listing, options = {}) {
  const statusColors = { available: '#3D6B2C', pending: '#C49A5A', rented: '#999' };
  const statusLabels = { available: 'Available', pending: 'Application Pending', rented: 'Rented' };
  const detailHref = `listing.html?id=${listing.id}`;

  const featuresHtml = listing.features && listing.features.length
    ? `<div class="property-card-meta">${listing.features.slice(0,4).map(f => `<span>&#10003; ${escapeHtml(f)}</span>`).join('')}</div>`
    : '';

  const statusBadge = listing.status !== 'available'
    ? `<div class="property-badge" style="background:${statusColors[listing.status]};color:#fff;position:absolute;top:12px;right:12px;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;">${statusLabels[listing.status]}</div>`
    : '';

  return `
    <div class="property-card" data-type="${listing.type}" data-beds="${Math.floor(listing.beds)}" data-state="${listing.state}">
      <div class="property-card-image-wrap">
        <a href="${detailHref}">${listingImageHtml(listing, options)}</a>
        <div class="property-badge ${listing.type === 'long-term' ? 'badge-long-term' : 'badge-short-term'}">
          ${listing.type === 'long-term' ? 'Long-Term' : 'Short-Term'}
        </div>
        ${statusBadge}
      </div>
      <div class="property-card-body">
        <div class="property-card-price">$${listing.price.toLocaleString()}<span>${escapeHtml(listing.priceLabel)}</span></div>
        <a href="${detailHref}" class="property-card-title">${escapeHtml(listing.title)}</a>
        <div class="property-card-location">&#128205; ${escapeHtml(listing.address)}</div>
        <div class="property-card-meta">
          <span>&#127968; ${listing.beds} Bed${listing.beds !== 1 ? 's' : ''}</span>
          ${listing.baths == null || listing.baths === '' ? `<span>&#128703; See listing</span>` : `<span>&#128703; ${listing.baths} Bath${listing.baths !== 1 ? 's' : ''}</span>`}
          ${listing.sqft ? `<span>&#9632; ${listing.sqft.toLocaleString()} sqft</span>` : ''}
        </div>
        ${featuresHtml}
        <p class="property-card-desc">${escapeHtml(listing.description)}</p>
        <div class="property-card-avail">
          &#128197; Available: ${escapeHtml(listing.availableDate)}
        </div>
        <div class="property-card-footer">
          <a href="contact.html?property=${listing.id}" class="btn btn-outline">Inquire</a>
          ${longTermActionButtons(listing)}
          ${externalListingButtons(listing)}
        </div>
      </div>
    </div>
  `;
}

function buildListingDetail(listing) {
  const features = (listing.features || []).map(f => `<li>${escapeHtml(f)}</li>`).join('');
  return `
    <article class="listing-detail">
      <div class="listing-detail-media">${listingImageHtml(listing, { lazy: false })}</div>
      <div class="listing-detail-body">
        <p class="section-eyebrow">${listing.type === 'long-term' ? 'Long-Term Rental' : 'Short-Term Stay'}</p>
        <h1>${escapeHtml(listing.title)}</h1>
        <p class="listing-detail-address">${escapeHtml(listing.address)}</p>
        <p class="listing-detail-price">$${listing.price.toLocaleString()}<span>${escapeHtml(listing.priceLabel)}</span></p>
        <ul class="listing-detail-facts">
          <li>${listing.beds} bedroom${listing.beds === 1 ? '' : 's'}</li>
          <li>${listing.baths == null || listing.baths === '' ? 'Bath count on request' : `${listing.baths} bath${Number(listing.baths) === 1 ? '' : 's'}`}</li>
          ${listing.sqft ? `<li>${listing.sqft.toLocaleString()} sqft</li>` : ''}
          <li>Available ${escapeHtml(listing.availableDate)}</li>
        </ul>
        <p>${escapeHtml(listing.description)}</p>
        ${features ? `<ul class="listing-detail-features">${features}</ul>` : ''}
        <div class="property-card-footer">
          <a href="contact.html?property=${listing.id}" class="btn btn-outline">Inquire</a>
          ${longTermActionButtons(listing)}
          ${externalListingButtons(listing)}
        </div>
      </div>
    </article>
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
    featuredGrid.innerHTML = featured.map((listing, index) => buildCard(listing, { lazy: index !== 0 })).join('');
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

  listingsGrid.innerHTML = filtered.length ? filtered.map((listing, index) => buildCard(listing, { lazy: index !== 0 })).join('') : '';

  if (listingsCount) {
    listingsCount.textContent = `Showing ${filtered.length} propert${filtered.length === 1 ? 'y' : 'ies'}`;
  }
  if (noResults) {
    noResults.classList.toggle('hidden', filtered.length > 0);
  }
}

if (listingsGrid) {
  if (listingsGrid.querySelector('.property-card')) {
    const n = listingsGrid.querySelectorAll('.property-card').length;
    if (listingsCount) listingsCount.textContent = `Showing ${n} propert${n === 1 ? 'y' : 'ies'}`;
  } else {
    applyFilters();
  }
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

const listingDetail = document.getElementById('listingDetail');
if (listingDetail && typeof LISTINGS !== 'undefined') {
  const listingId = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
  const listing = LISTINGS.find(l => l.id === listingId);
  if (!listing) {
    listingDetail.innerHTML = '<p class="listing-missing">That listing is not available. <a href="listings.html">View available rentals</a>.</p>';
  } else {
    document.title = `${listing.address} | Porch & Pine Property Management`;
    listingDetail.innerHTML = buildListingDetail(listing);
  }
}

if (contactForm) {
  // Pre-fill property if coming from a listing inquiry
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get('property');
  if (propertyId && typeof LISTINGS !== 'undefined') {
    const prop = LISTINGS.find(l => l.id === parseInt(propertyId));
    if (prop) {
      const msgField = document.getElementById('message');
      if (msgField && !msgField.value) msgField.value = `I am interested in: ${prop.title} (${prop.address})`;
    }
  }
  const subject = params.get('subject');
  const subjectField = document.getElementById('subjectLine');
  if (subject && subjectField) subjectField.value = subject;

  bindLeadForm(contactForm, formSuccess);
}

function bindLeadForm(form, successEl) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!String(field.value).trim()) { field.style.borderColor = '#c0392b'; valid = false; }
      else field.style.borderColor = '';
    });
    if (!valid) return;
    // Same behavior as the contact form: there is no backend, so this only confirms on the page.
    form.classList.add('hidden');
    if (successEl) successEl.classList.remove('hidden');
  });
}

const ownerForm = document.getElementById('ownerForm');
if (ownerForm) bindLeadForm(ownerForm, document.getElementById('ownerFormSuccess'));
