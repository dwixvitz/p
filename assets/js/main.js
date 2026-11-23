document.addEventListener("DOMContentLoaded", async () => {
  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  const rootEl = document.documentElement;
  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme) {
    rootEl.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    rootEl.setAttribute("data-theme", "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = rootEl.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      rootEl.setAttribute("data-theme", next);
      localStorage.setItem("portfolio-theme", next);
    });
  }

  // Mobile Menu
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // Load Portfolio Data from data/portfolio.json
  let data = null;
  try {
    const res = await fetch("data/portfolio.json");
    if (!res.ok) throw new Error("Gagal memuat data/portfolio.json");
    data = await res.json();
  } catch (err) {
    console.error(err);
    return;
  }

  const profile = data.profile || {};

  // Populate Brand & Footer
  document.querySelectorAll("[data-brand-name]").forEach(el => {
    el.textContent = profile.name || "Portofolio";
  });

  const footerInfo = document.getElementById("footerInfo");
  if (footerInfo) {
    footerInfo.innerHTML = `<strong>${escapeHtml(profile.name || "")}</strong> &mdash; ${escapeHtml(profile.role || "")} (${escapeHtml(profile.location || "")})`;
  }

  const footerSocials = document.getElementById("footerSocials");
  if (footerSocials && Array.isArray(profile.socials)) {
    footerSocials.innerHTML = profile.socials.map(s =>
      `<a href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a>`
    ).join("");
  }

  // Home Page Elements
  const heroAvailability = document.getElementById("heroAvailability");
  if (heroAvailability) heroAvailability.textContent = profile.availability || "";

  const heroTagline = document.getElementById("heroTagline");
  if (heroTagline) heroTagline.textContent = profile.tagline || "";

  const heroBio = document.getElementById("heroBio");
  if (heroBio) heroBio.textContent = profile.bio || "";

  const heroAvatar = document.getElementById("heroAvatar");
  if (heroAvatar && profile.avatar) {
    heroAvatar.src = profile.avatar;
    heroAvatar.alt = `Foto Profil ${profile.name || ""}`;
  }

  const heroCaption = document.getElementById("heroCaption");
  if (heroCaption) {
    heroCaption.textContent = `${profile.name || ""} • ${profile.location || ""}`;
  }

  // Biodata Grid (Home preview or Full About page)
  const bioGrid = document.getElementById("biodataGrid");
  if (bioGrid && Array.isArray(data.biodata)) {
    const limit = bioGrid.dataset.limit ? parseInt(bioGrid.dataset.limit, 10) : data.biodata.length;
    bioGrid.innerHTML = data.biodata.slice(0, limit).map(item => `
      <div class="bio-item liquid-glass">
        <span class="bio-label">${escapeHtml(item.label)}</span>
        <span class="bio-value">${escapeHtml(item.value)}</span>
      </div>
    `).join("");
  }

  // Projects Grid (Home or Projects page)
  const projectsGrid = document.getElementById("projectsGrid");
  if (projectsGrid && Array.isArray(data.projects)) {
    const showLink = projectsGrid.dataset.showLink === "true";
    projectsGrid.innerHTML = data.projects.map(p => `
      <article class="project-card liquid-glass">
        <div class="project-thumb">
          <img src="${escapeAttr(p.image || "assets/images/project-1.svg")}" alt="Pratinjau ${escapeAttr(p.title)}" loading="lazy">
        </div>
        <div class="project-body">
          <div class="project-meta">
            <span>${escapeHtml(p.category || "")}</span>
            <span>${escapeHtml(p.year || "")}</span>
          </div>
          <h3 class="project-title">${escapeHtml(p.title || "")}</h3>
          <p class="project-summary">${escapeHtml(p.summary || "")}</p>
          <div class="tag-row" style="${showLink ? "margin-bottom: 1rem;" : ""}">
            ${(p.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
          ${showLink ? `<div><a href="${escapeAttr(p.link || "#")}" class="section-link">Detail Proyek &rarr;</a></div>` : ""}
        </div>
      </article>
    `).join("");
  }

  // Education Timeline
  const educationList = document.getElementById("educationList");
  if (educationList && Array.isArray(data.education)) {
    educationList.innerHTML = data.education.map(edu => `
      <article class="timeline-card liquid-glass">
        <div><span class="timeline-period">${escapeHtml(edu.period || "")}</span></div>
        <div>
          <h3 class="timeline-title">${escapeHtml(edu.institution || "")}</h3>
          <div class="timeline-meta">${escapeHtml(edu.degree || "")} &bull; ${escapeHtml(edu.gpa || "")}</div>
          <p class="timeline-desc">${escapeHtml(edu.description || "")}</p>
        </div>
      </article>
    `).join("");
  }

  // Experience Timeline
  const experienceList = document.getElementById("experienceList");
  if (experienceList && Array.isArray(data.experience)) {
    experienceList.innerHTML = data.experience.map(exp => `
      <article class="timeline-card liquid-glass">
        <div><span class="timeline-period">${escapeHtml(exp.period || "")}</span></div>
        <div>
          <h3 class="timeline-title">${escapeHtml(exp.role || "")}</h3>
          <div class="timeline-meta">${escapeHtml(exp.company || "")}</div>
          <p class="timeline-desc">${escapeHtml(exp.summary || "")}</p>
        </div>
      </article>
    `).join("");
  }

  // Skills Grid
  const skillsGrid = document.getElementById("skillsGrid");
  if (skillsGrid && Array.isArray(data.skills)) {
    skillsGrid.innerHTML = data.skills.map(group => `
      <div class="skill-card liquid-glass">
        <h3>${escapeHtml(group.category || "")}</h3>
        <div class="tag-row">
          ${(group.items || []).map(sk => `<span class="tag">${escapeHtml(sk)}</span>`).join("")}
        </div>
      </div>
    `).join("");
  }

  // Contact Direct Info
  const contactDirect = document.getElementById("contactDirect");
  if (contactDirect) {
    contactDirect.innerHTML = `
      <div><span class="bio-label">Email</span><span class="bio-value">${escapeHtml(profile.email || "")}</span></div>
      <div><span class="bio-label">Telepon / WhatsApp</span><span class="bio-value">${escapeHtml(profile.phone || "")}</span></div>
      <div><span class="bio-label">Domisili</span><span class="bio-value">${escapeHtml(profile.location || "")}</span></div>
    `;
  }

  // Static Contact Form Handler
  const contactForm = document.getElementById("staticContactForm");
  const contactNotice = document.getElementById("contactNotice");
  if (contactForm && contactNotice) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameVal = document.getElementById("name")?.value.trim() || "";
      contactNotice.textContent = `Terima kasih ${nameVal || "Anda"}, formulir statis di GitHub Pages tidak mengirim email langsung ke server. Anda dapat menghubungi ${profile.email || "email tertera"} secara langsung.`;
      contactNotice.classList.add("show");
      contactForm.reset();
    });
  }
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}
