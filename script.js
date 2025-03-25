const jobListings = document.getElementById("job-listings");
const filterBar = document.getElementById("filter-bar");
const filterTags = document.getElementById("filter-tags");
const clearBtn = document.getElementById("clear-filters");

let filters = [];

async function fetchJobs() {
  const res = await fetch("data.json");
  const jobs = await res.json();
  console.log(jobs);
  
  displayJobs(jobs);
}

function displayJobs(jobs) {
  jobListings.innerHTML = "";

  const filteredJobs = filters.length
    ? jobs.filter((job) => {
        const tags = [job.role, job.level, ...job.languages, ...job.tools];
        return filters.every((filter) => tags.includes(filter));
      })
    : jobs;

  filteredJobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";
    if (job.featured) card.classList.add("featured");

    const tags = [job.role, job.level, ...job.languages, ...job.tools];

    card.innerHTML = `
      <img src="${job.logo.replace("./", "")}" alt="${
      job.company
    } logo" width="50">
      <div class="job-info">
        <div>
          <span class="job-company">${job.company}</span>
          ${job.new ? '<span class="badges">NEW!</span>' : ""}
          ${job.featured ? '<span class="badges">FEATURED</span>' : ""}
        </div>
        <div class="position">${job.position}</div>
        <div class="meta">${job.postedAt} · ${job.contract} · ${
      job.location
    }</div>
      </div>
      <div class="skill-tags">
        ${tags
          .map((tag) => `<span class="tag" data-tag="${tag}">${tag}</span>`)
          .join("")}
      </div>
    `;

    jobListings.appendChild(card);
  });

  addTagClickEvents();
}

function addTagClickEvents() {
  document.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      const tagValue = tag.getAttribute("data-tag");
      if (!filters.includes(tagValue)) {
        filters.push(tagValue);
        updateFilterBar();
        fetchJobs();
      }
    });
  });
}

function updateFilterBar() {
  filterTags.innerHTML = filters
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  filterBar.classList.toggle("hidden", filters.length === 0);
}

clearBtn.addEventListener("click", () => {
  filters = [];
  updateFilterBar();
  fetchJobs();
});

fetchJobs();

