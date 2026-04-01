import { getProjectBySlug, siteContent } from "./content.mjs";
import { escapeHtml, qs } from "./utils.mjs";

bootstrap();

function bootstrap() {
  const slug = new URLSearchParams(window.location.search).get("slug");
  const project = slug ? getProjectBySlug(slug) : null;

  qs("[data-project-brand]").textContent = siteContent.brand;
  qs("[data-project-footer]").textContent = `${siteContent.footer} © ${new Date().getFullYear()}`;

  if (!project) {
    renderMissingProject();
    return;
  }

  renderProject(project);
}

function renderProject(project) {
  document.title = `${project.name} | ${siteContent.brand}`;

  const detail = project.detail ?? {};
  const overview = detail.overview?.length ? detail.overview : [project.description];
  const highlights = detail.highlights?.length ? detail.highlights : project.tags;
  const gallery = detail.gallery ?? [];

  qs("[data-project-eyebrow]").textContent = "Project page";
  qs("[data-project-name]").textContent = project.name;
  qs("[data-project-subtitle]").textContent = project.subtitle;
  qs("[data-project-summary]").textContent = detail.summary ?? project.description;

  const icon = qs("[data-project-icon]");
  icon.dataset.tone = project.tone;
  icon.innerHTML = project.iconImage
    ? `<img src="${project.iconImage}" alt="${escapeHtml(project.name)} icon" loading="lazy" />`
    : escapeHtml(project.icon);

  qs("[data-project-tags]").innerHTML = project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  qs("[data-project-actions]").innerHTML = renderActionButtons(buildProjectActions(project));
  qs("[data-project-overview]").innerHTML = overview.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
  qs("[data-project-highlights]").innerHTML = highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  qs("[data-project-gallery-title]").textContent = detail.galleryTitle ?? "Screenshots";
  qs("[data-project-gallery-copy]").textContent =
    detail.galleryIntro ?? "Keep additional visuals and context here instead of expanding the homepage cards.";
  qs("[data-project-gallery]").innerHTML = gallery.length
    ? gallery.map(renderGalleryItem).join("")
    : renderGalleryEmptyState(detail);
}

function renderMissingProject() {
  document.title = `Project not found | ${siteContent.brand}`;
  qs("[data-project-eyebrow]").textContent = "Project page";
  qs("[data-project-name]").textContent = "Project not found";
  qs("[data-project-subtitle]").textContent = "This project link no longer points to a valid entry.";
  qs("[data-project-summary]").textContent = "Return to the portfolio and open another project.";
  qs("[data-project-tags]").innerHTML = "";
  qs("[data-project-actions]").innerHTML = renderActionButtons([
    { label: "Back to portfolio", href: "./index.html#projects", external: false }
  ]);
  qs("[data-project-overview]").innerHTML = "<p>The requested project slug was missing from the content configuration.</p>";
  qs("[data-project-highlights]").innerHTML = "<li>Check the project link in the main portfolio page</li>";
  qs("[data-project-gallery]").innerHTML = renderGalleryEmptyState({});
}

function buildProjectActions(project) {
  const labels = {
    appStore: "App Store",
    github: "GitHub",
    demo: "Pitch",
    developerPage: "Developer page",
    website: "Website"
  };

  return Object.entries(labels)
    .filter(([key]) => Boolean(project.links?.[key]))
    .map(([key, label]) => ({ label, href: project.links[key], external: true }));
}

function renderActionButtons(actions = []) {
  return actions
    .map(
      (action) =>
        `<a class="button button-secondary button-compact" href="${action.href}"${
          action.external ? ' target="_blank" rel="noreferrer"' : ""
        }>${escapeHtml(action.label)}</a>`
    )
    .join("");
}

function renderGalleryItem(item) {
  return `<figure class="project-shot">
    <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" />
    <figcaption>
      <p class="project-shot__title">${escapeHtml(item.title)}</p>
      <p class="project-shot__caption">${escapeHtml(item.caption)}</p>
    </figcaption>
  </figure>`;
}

function renderGalleryEmptyState(detail) {
  const title = detail.emptyGalleryTitle ?? "Screenshots can live here";
  const text =
    detail.emptyGalleryText ??
    "This project page is ready for screenshots whenever you want to add them in the content file.";

  return `<div class="project-empty">
    <p class="project-empty__title">${escapeHtml(title)}</p>
    <p class="project-empty__text">${escapeHtml(text)}</p>
  </div>`;
}
