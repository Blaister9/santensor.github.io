import { createRun, stepRun } from "./workflow.mjs";
import { catalogs } from "./i18n.mjs";
import { cinematicCopy } from "./cinematic-copy.mjs";
const escape = (v) =>
  String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export function operationMarkup(language, index) {
  const c = cinematicCopy[language],
    lab = catalogs[language].lab;
  if (index === 0)
    return `<label class="field-label" for="scenario">${c.scenario}</label><select id="scenario" data-scenario>${["success", "ambiguous", "failure"].map((s, i) => `<option value="${s}">${lab.scenarios[i]}</option>`).join("")}</select><label class="field-label" for="request">${c.request}</label><textarea id="request" data-request minlength="20" maxlength="600" rows="4" aria-describedby="request-hint">${escape(lab.fixtures[0])}</textarea><p id="request-hint" class="hint">${c.editHint}</p><div class="operation-controls"><button class="primary" data-run>${c.run} <span aria-hidden="true">↗</span></button><button data-break>${c.break}</button><button data-reset>${c.reset}</button></div><p class="operation-note">${c.localNote}</p><p class="operation-error" data-error role="alert"></p>`;
  if (index === 1)
    return `<div class="process-header mono"><span>NS-204</span><span data-execution-count>00 / 06</span></div><div class="process-timeline" role="group" aria-label="${c.timeline}">${lab.stages.map((label, i) => `<button data-inspect-stage="${i}" class="process-node" aria-pressed="false" disabled><span class="mono">0${i + 1}</span><span>${label}</span><i aria-hidden="true"></i></button>`).join("")}</div><div class="execution-progress" role="progressbar" aria-label="${c.progress}" aria-valuemin="0" aria-valuemax="5" aria-valuenow="0"><i></i></div><p class="execution-status" data-status role="status">${c.ready}</p><div class="operation-controls"><button data-step>${c.next}</button><button data-pause disabled>${c.pause}</button><button data-retry hidden>${c.retry}</button></div><div class="review-controls" data-review hidden><p>${lab.humanNote}</p><div class="actions"><button class="primary" data-approve>${c.approve}</button><button data-reject>${c.reject}</button><button data-correct hidden>${c.correct}</button></div><p class="hint" data-uncertain hidden>${c.safety}</p></div>`;
  return `<div class="evidence-heading"><span class="mono" data-evidence-mode>${c.current}</span><span class="mono" data-evidence-stage>—</span></div><p class="evidence-description" data-evidence-description>${c.idleEvidence}</p><dl id="lab-result" tabindex="-1" class="evidence-values" data-evidence-values></dl><details class="event-trace" open><summary>${c.trace}</summary><ol data-event-log></ol></details><div class="evidence-actions"><button data-export disabled>${c.download} ↓</button><a href="#scene-4" data-go="4" data-view-result hidden>${c.reviewResult} ↗</a></div>`;
}

export function mountOperation({
  language: initialLanguage,
  onChange = () => {},
} = {}) {
  let language = initialLanguage ?? document.documentElement.lang,
    run = null,
    timer = null,
    selected = -1,
    scenario = "success",
    input = catalogs[language].lab.fixtures[0],
    invalid = false,
    panel = 0,
    eventSnapshots = [],
    eventSnapshot = null;
  const get = (q) => document.querySelector(q),
    all = (q) => document.querySelectorAll(q);
  const targets = () => [
    ...all("[data-surface] .surface-app"),
    ...all("[data-standalone-lab] .standalone-surface"),
  ];
  function labels() {
    targets().forEach((el, i) => (el.innerHTML = operationMarkup(language, i)));
    if (get('[data-standalone-lab]')) {
      const resultLink = get('[data-view-result]');
      resultLink.href = '#lab-result';
      resultLink.removeAttribute('data-go');
    }
    const request = get("[data-request]");
    if (request) request.value = input;
    const select = get("[data-scenario]");
    if (select) select.value = scenario;
    paint();
  }
  function stop() {
    clearTimeout(timer);
    timer = null;
  }
  function value(v) {
    const lab = catalogs[language].lab;
    return lab.values[v] ?? (v == null ? "—" : String(v));
  }
  function rows(snapshot) {
    if (!snapshot) return [];
    const f = snapshot.fields,
      tool = snapshot.tool;
    if (snapshot.stage === 0)
      return [[cinematicCopy[language].request, snapshot.text]];
    const data = [];
    if (f) {
      for (const k of ["reference", "category", "certainty", "method"])
        data.push([cinematicCopy[language].fields[k], value(f[k])]);
    }
    if (snapshot.policy)
      data.push([
        cinematicCopy[language].fields.policy,
        value(snapshot.policy),
      ]);
    if (tool) {
      data.push(
        [cinematicCopy[language].fields.status, String(tool.status)],
        [cinematicCopy[language].fields.auth, value(tool.auth)],
      );
    }
    if (snapshot.result)
      for (const [k, v] of Object.entries(snapshot.result))
        data.push([cinematicCopy[language].fields[k] ?? k, value(v)]);
    return data;
  }
  function paint() {
    const c = cinematicCopy[language],
      lab = catalogs[language].lab;
    const status = invalid
      ? c.invalid
      : !run
        ? c.ready
        : run.failed
          ? c.failed
          : run.stage === 5
            ? c.done
            : run.stage === 4
              ? c.review
              : timer
                ? c.running
                : lab.paused;
    if (get("[data-status]")) get("[data-status]").textContent = status;
    if (get("[data-error]"))
      get("[data-error]").textContent = invalid ? c.invalid : "";
    if (get("[data-request]"))
      get("[data-request]").setAttribute("aria-invalid", String(invalid));
    if (get("[data-execution-count]"))
      get("[data-execution-count]").textContent =
        `${String(run ? run.stage + 1 : 0).padStart(2, "0")} / 06`;
    all("[data-inspect-stage]").forEach((el, i) => {
      el.disabled = !run || i > run.stage;
      el.classList.toggle("complete", !!run && i < run.stage);
      el.classList.toggle("current", run?.stage === i);
      el.classList.toggle("failed", Boolean(run?.failed && i === 3));
      el.setAttribute(
        "aria-pressed",
        String((selected >= 0 ? selected : run?.stage) === i),
      );
    });
    const bar = get(".execution-progress");
    if (bar) {
      bar.setAttribute("aria-valuenow", String(run?.stage ?? 0));
      bar.querySelector("i").style.width = `${(run?.stage ?? 0) * 20}%`;
    }
    for (const selector of ["[data-run]", "[data-step]"])
      if (get(selector))
        get(selector).disabled =
          (!!run && (run.failed || run.stage >= 4)) || !!timer;
    if (get("[data-pause]")) get("[data-pause]").disabled = !timer;
    if (get("[data-retry]")) get("[data-retry]").hidden = !run?.failed;
    const review = run?.stage === 4;
    if (get("[data-review]")) get("[data-review]").hidden = !review;
    if (get("[data-approve]"))
      get("[data-approve]").disabled = run?.policy !== "review";
    if (get("[data-correct]"))
      get("[data-correct]").hidden = run?.policy !== "triage";
    if (get("[data-uncertain]"))
      get("[data-uncertain]").hidden = run?.policy !== "triage";
    if (get("[data-view-result]"))
      get("[data-view-result]").hidden = run?.stage !== 5;
    if (get("[data-export]")) get("[data-export]").disabled = !run;
    const snapshot =
      eventSnapshot ?? run?.snapshots[selected >= 0 ? selected : run.stage];
    if (get("[data-evidence-mode]"))
      get("[data-evidence-mode]").textContent =
        selected >= 0 && selected !== run?.stage ? c.historical : c.current;
    if (get("[data-evidence-stage]"))
      get("[data-evidence-stage]").textContent = snapshot
        ? `0${snapshot.stage + 1}`
        : "—";
    if (get("[data-evidence-description]"))
      get("[data-evidence-description]").textContent = snapshot
        ? lab.stageDescriptions[snapshot.stage]
        : c.idleEvidence;
    if (get("[data-evidence-values]"))
      get("[data-evidence-values]").innerHTML = rows(snapshot)
        .map(
          ([k, v]) => `<div><dt>${escape(k)}</dt><dd>${escape(v)}</dd></div>`,
        )
        .join("");
    if (get("[data-event-log]"))
      get("[data-event-log]").innerHTML = run
        ? run.events
            .map(
              (event) =>
                `<li><button data-event="${event.sequence - 1}"><span class="mono">${String(event.sequence).padStart(2, "0")}</span> ${escape(lab.eventText[event.code])}</button></li>`,
            )
            .join("")
        : "";
    document.body.dataset.execution = run?.failed
      ? "failed"
      : run?.stage === 5
        ? "complete"
        : review
          ? "review"
          : timer
            ? "running"
            : "idle";
    onChange();
  }
  function ensure() {
    if (!run) {
      run = createRun(input, scenario);
      selected = -1;
      eventSnapshot = null;
      eventSnapshots = [structuredClone(run.snapshots[0])];
    }
    invalid = false;
  }
  function commit(action) {
    try {
      ensure();
      run = stepRun(run, action);
      eventSnapshots.push(structuredClone(run.snapshots[run.stage]));
      eventSnapshot = null;
      selected = -1;
      invalid = false;
    } catch (error) {
      invalid = error.message === "INVALID_INPUT";
      if (!invalid) console.error(error);
    }
    paint();
  }
  function tick() {
    timer = null;
    if (!run || run.failed || run.stage >= 4) {
      paint();
      return;
    }
    commit();
    if (!run.failed && run.stage < 4) {
      timer = setTimeout(tick, 480);
    }
    paint();
  }
  function start() {
    stop();
    try {
      ensure();
      timer = setTimeout(tick, 200);
      panel = 1;
    } catch {
      invalid = true;
    }
    paint();
  }
  function reset() {
    stop();
    run = null;
    selected = -1;
    eventSnapshot = null;
    eventSnapshots = [];
    invalid = false;
    paint();
  }
  function inputChanged() {
    input = get("[data-request]").value;
    reset();
  }
  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-request]")) inputChanged();
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-scenario]")) {
      scenario = event.target.value;
      input =
        catalogs[language].lab.fixtures[
          ["success", "ambiguous", "failure"].indexOf(scenario)
        ];
      get("[data-request]").value = input;
      reset();
    }
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest('[data-view-result]') && get('[data-standalone-lab]')) {
      selected = 5;
      eventSnapshot = null;
      paint();
      get('#lab-result').focus();
    }
    const el = event.target.closest("button");
    if (!el) return;
    if (el.matches("[data-run]")) start();
    if (el.matches("[data-step]")) {
      stop();
      try {
        if (!run) {
          ensure();
          paint();
        } else commit();
      } catch {
        invalid = true;
        paint();
      }
      panel = 1;
      onChange();
    }
    if (el.matches("[data-pause]")) {
      stop();
      paint();
    }
    if (el.matches("[data-reset]")) {
      scenario = "success";
      input = catalogs[language].lab.fixtures[0];
      get("[data-request]").value = input;
      get("[data-scenario]").value = scenario;
      reset();
    }
    if (el.matches("[data-break]")) {
      scenario = "failure";
      get("[data-scenario]").value = scenario;
      reset();
      start();
    }
    if (el.matches("[data-retry]")) {
      commit("retry");
      panel = 1;
      onChange();
    }
    for (const [selector, action] of [
      ["[data-approve]", "approve"],
      ["[data-reject]", "reject"],
      ["[data-correct]", "correct"],
    ])
      if (el.matches(selector)) {
        stop();
        commit(action);
        panel = 2;
        onChange();
      }
    if (el.matches("[data-inspect-stage]")) {
      selected = Number(el.dataset.inspectStage);
      eventSnapshot = null;
      panel = 2;
      paint();
    }
    if (el.matches("[data-event]")) {
      const i = Number(el.dataset.event),
        e = run.events[i];
      selected = e.stage;
      eventSnapshot = eventSnapshots[i];
      panel = 2;
      paint();
    }
    if (el.matches("[data-export]") && run) {
      const blob = new Blob(
        [
          JSON.stringify(
            {
              disclosure: cinematicCopy[language].localNote,
              run,
              eventSnapshots,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "santensor-synthetic-trace.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    if (el.matches("[data-panel-tab]")) {
      panel = Number(el.dataset.panelTab);
      onChange();
    }
  });
  labels();
  return {
    setLanguage(next) {
      const previous = catalogs[language].lab.fixtures;
      const fixtureIndex = previous.indexOf(input);
      language = next;
      if (!run && fixtureIndex >= 0)
        input = catalogs[language].lab.fixtures[fixtureIndex];
      labels();
    },
    get run() {
      return run ? structuredClone(run) : null;
    },
    get panel() {
      return panel;
    },
    set panel(p) {
      panel = p;
      onChange();
    },
    get state() {
      return {
        run: run ? structuredClone(run) : null,
        scenario,
        selected,
        panel,
        input,
        running: !!timer,
      };
    },
    paint,
    dispose: stop,
  };
}
