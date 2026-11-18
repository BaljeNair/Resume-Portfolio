# Joiner–Mover–Leaver Workflow Simulator

## Project type
Personal project · Browser-based operations simulator · Synthetic data

## Problem
Identity and device lifecycle work is often described as a list of tickets. That hides the operational risk: a joiner needs access and equipment ready on day one, a mover needs access changed with the role, and a leaver needs access removed and equipment recovered at the right time.

For a portfolio project, the challenge was to make that lifecycle visible without connecting to a real directory, ITSM platform, or employer environment.

## Approach
I modelled three controlled workflow states:

- **Joiner:** confirm the manager and start date, create identity access, prepare an encrypted device, validate MFA and collaboration access, then record the handoff.
- **Mover:** confirm the new role and effective date, review old access, apply the new access profile, reconcile device and software needs, and record approval evidence.
- **Leaver:** confirm the last working day, disable identity and active sessions, remove access, recover the device, and record closure evidence.

Each flow uses the same interaction pattern: choose an event, complete the checklist, see progress update, and inspect the audit trail. Switching event type resets the checklist so the demo does not imply that one person’s state carries into another lifecycle event.

## Tools

- HTML and semantic form controls
- CSS using the portfolio’s operations-console visual system
- Vanilla JavaScript and DOM state
- Local workflow definitions with no external dependencies

## What the project demonstrates

The simulator is intentionally small, but it shows several enterprise-support habits:

1. Treat identity, device, approval, and evidence as connected controls.
2. Make the next owner’s responsibilities visible rather than relying on memory.
3. Separate a workflow’s current state from its final closure state.
4. Keep synthetic demonstration data clearly separated from production systems.

## Outcome
The result is an interactive explanation of ITSM and identity-management thinking. A recruiter can switch between joiner, mover, and leaver scenarios, complete controls, and see how the handoff becomes more explicit as the workflow progresses.

The project does not claim to automate real Entra ID, Intune, ServiceNow, or directory actions. Its purpose is to demonstrate the reasoning and interface design behind a safer operational workflow.

## Data and safety note
This is a personal project. All names, dates, assignments, and workflow records are fictional synthetic data. The simulator does not connect to or modify any real identity, device, ticketing, or application system.

## Local demo

From the repository root:

```bash
python -m http.server 4177
```

Open:

```text
http://localhost:4177/projects/jml-workflow/
```
