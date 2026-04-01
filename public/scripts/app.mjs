import { getProjectHref, siteContent } from "./content.mjs";
import { createFirebaseService } from "./firebase-service.mjs";
import { firebaseSettings } from "./firebase-config.mjs";
import { initializeLiveCursorLayer } from "./live-cursors.mjs";
import { getOrCreateAnalyticsSession, touchAnalyticsSession } from "./source-tracking.mjs";
import { prefersReducedMotion, qs, qsa } from "./utils.mjs";

bootstrap();

async function bootstrap() {
  renderSite();
  setupRevealAnimations();

  const service = await createFirebaseService();
  const liveCountElements = qsa("[data-live-count]");
  const cursorLayer = qs("[data-cursor-layer]");

  if (service.firestoreEnabled) {
    const { session } = getOrCreateAnalyticsSession(firebaseSettings.sessionTtlMinutes || 30);
    await service.trackVisit(session);
    touchAnalyticsSession(firebaseSettings.sessionTtlMinutes || 30);
  }

  initializeLiveCursorLayer({
    service,
    layerElement: cursorLayer,
    countElements: liveCountElements
  });
}

function renderSite() {
  document.title = `${siteContent.hero.name} | ${siteContent.hero.title}`;

  const brand = qs("[data-site-brand]");
  if (brand) {
    brand.textContent = siteContent.brand;
  }

  const nav = qs("[data-site-nav]");
  nav.innerHTML = siteContent.navigation
    .map((item) => `<a href="${item.href}">${item.label}</a>`)
    .join("");

  qs("[data-hero-kicker]").textContent = siteContent.hero.kicker;
  const heroName = qs("[data-hero-name]");
  if (siteContent.hero.nameLines?.length) {
    heroName.innerHTML = siteContent.hero.nameLines
      .map((line) => `<span class="hero-name__line">${line}</span>`)
      .join("");
  } else {
    heroName.textContent = siteContent.hero.name;
  }
  qs("[data-hero-title]").textContent = siteContent.hero.title;
  qs("[data-hero-description]").textContent = siteContent.hero.description;
  qs("[data-hero-note]").textContent = siteContent.hero.note;

  const primaryButton = qs("[data-hero-primary]");
  primaryButton.textContent = siteContent.hero.primaryCta.label;
  primaryButton.href = siteContent.hero.primaryCta.href;

  const secondaryButton = qs("[data-hero-secondary]");
  secondaryButton.textContent = siteContent.hero.secondaryCta.label;
  secondaryButton.href = siteContent.hero.secondaryCta.href;

  const factList = qs("[data-hero-facts]");
  factList.innerHTML = siteContent.hero.facts
    .map(
      (fact) =>
        `<li><span class="hero-facts__label">${fact.label}</span><span class="hero-facts__value">${fact.value}</span></li>`
    )
    .join("");

  const projectGrid = qs("[data-project-grid]");
  projectGrid.innerHTML = siteContent.projects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-card__top">
            <div class="project-card__icon" data-tone="${project.tone}">
              ${
                project.iconImage
                  ? `<img src="${project.iconImage}" alt="${project.name} icon" loading="lazy" />`
                  : project.icon
              }
            </div>
            <div class="project-card__title-wrap">
              <h3 class="project-card__title">${project.name}</h3>
              <p class="project-card__subtitle">${project.subtitle}</p>
            </div>
          </div>
          <p class="project-card__description">${project.description}</p>
          <div class="tag-list">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="project-card__links action-row">
            ${renderProjectLinks(project)}
          </div>
        </article>
      `
    )
    .join("");

  const experienceList = qs("[data-experience-list]");
  experienceList.innerHTML = siteContent.experience
    .map(
      (item) => `
        <article class="timeline-card">
          <div class="timeline-card__header">
            <div>
              <h3 class="timeline-card__title">${item.role}</h3>
              <p class="timeline-card__company">${item.company}</p>
              ${
                item.companyLinks?.length
                  ? `<div class="timeline-card__links action-row">
                      ${renderActionButtons(item.companyLinks.map((link) => ({ ...link, external: true })))}
                    </div>`
                  : ""
              }
            </div>
            <span class="timeline-card__period">${item.dates}</span>
          </div>
          <ul class="timeline-card__impact">
            ${item.impact.map((point) => `<li>${point}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");

  const educationList = qs("[data-education-list]");
  educationList.innerHTML = siteContent.education
    .map(
      (item) => `
        <article class="education-card">
          <div class="education-card__header">
            <div>
              <h3 class="education-card__title">${item.institution}</h3>
              <p class="education-card__meta">${item.location}</p>
            </div>
            <span class="education-card__period">${item.dates}</span>
          </div>
          <p class="education-card__description">${item.description}</p>
        </article>
      `
    )
    .join("");

  const skillGroups = qs("[data-skill-groups]");
  skillGroups.innerHTML = siteContent.skillGroups
    .map(
      (group) => `
        <article class="skill-card">
          <h3 class="skill-card__title">${group.title}</h3>
          <ul class="skill-list">
            ${group.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");

  qs("[data-contact-heading]").textContent = siteContent.contact.heading;
  qs("[data-contact-description]").textContent = siteContent.contact.description;

  const contactLinks = qs("[data-contact-links]");
  contactLinks.innerHTML = siteContent.contact.links
    .map((link) => {
      const externalAttributes = link.href.startsWith("mailto:")
        ? ""
        : ' target="_blank" rel="noreferrer"';
      return `<a class="contact-link" href="${link.href}"${externalAttributes}>${link.label}</a>`;
    })
    .join("");

  qs("[data-footer-copy]").textContent = `${siteContent.footer} © ${new Date().getFullYear()}`;
}

function renderProjectLinks(project) {
  const linkLabels = {
    projectPage: "View project",
    appStore: "App Store",
    github: "GitHub",
    demo: "Pitch",
    developerPage: "Developer page",
    website: "Website"
  };

  const actions = Object.entries(linkLabels)
    .filter(([key]) => {
      if (key === "projectPage") {
        return Boolean(project.slug);
      }

      return Boolean(project.links?.[key]);
    })
    .map(([key, label]) => ({
      label,
      href: key === "projectPage" ? getProjectHref(project.slug) : project.links[key],
      external: key !== "projectPage"
    }));

  return renderActionButtons(actions);
}

function renderActionButtons(actions = []) {
  return actions.map(renderActionButton).join("");
}

function renderActionButton(action) {
  const externalAttributes = action.external ? ' target="_blank" rel="noreferrer"' : "";
  return `<a class="button button-secondary button-compact" href="${action.href}"${externalAttributes}>${action.label}</a>`;
}

function setupRevealAnimations() {
  const revealElements = qsa(".reveal");
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => observer.observe(element));
}
