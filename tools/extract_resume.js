// Lightweight PDF text extractor + heuristic parser for resume sections
// Usage: node tools/extract_resume.js "Balje Nair Resume July 2025.pdf" > assets/resume.json

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

function splitLines(text){
	return text.replace(/\r/g, '').split(/\n+/).map(l => l.trim()).filter(Boolean);
}

function findSection(lines, headerRegex, stopRegexes){
	const startIdx = lines.findIndex(l => headerRegex.test(l));
	if (startIdx === -1) return '';
	let endIdx = lines.length;
	for (const re of stopRegexes){
		const idx = lines.slice(startIdx + 1).findIndex(l => re.test(l));
		if (idx !== -1) endIdx = Math.min(endIdx, startIdx + 1 + idx);
	}
	return lines.slice(startIdx + 1, endIdx).join('\n').trim();
}

function parseExperience(sectionText){
	const lines = splitLines(sectionText);
	const experiences = [];
	let current = null;
	const dateLike = /(20\d{2}|19\d{2}).{0,5}(Present|\d{4})/i;
	lines.forEach(l => {
		// Bullet
		if (/^[•\-\u2022]/.test(l)){
			const bullet = l.replace(/^[•\-\u2022]\s*/, '').trim();
			if (current){
				current.bullets.push(bullet);
			}
			return;
		}
		// Title line (often contains hyphen between role and company)
		if (/\s-\s|\s–\s/.test(l)){
			if (current) experiences.push(current);
			current = { title: l.trim(), dates: '', bullets: [] };
			return;
		}
		// Dates line
		if (dateLike.test(l)){
			if (!current) current = { title: '', dates: '', bullets: [] };
			current.dates = l.trim();
			return;
		}
		// Fallback: treat as bullet if inside an experience
		if (current){
			current.bullets.push(l.trim());
		}
	});
	if (current) experiences.push(current);
	return experiences.filter(e => e.title || e.bullets.length);
}

function parseEducation(sectionText){
	const lines = splitLines(sectionText);
	const items = [];
	let current = null;
	lines.forEach(l => {
		if (!current){
			current = { degree: l, institution: '', date: '', notes: '' };
			return;
		}
		if (!current.institution && /University|College|Institute|School/i.test(l)){
			current.institution = l;
			return;
		}
		if (!current.date && /(20\d{2}|19\d{2})/.test(l)){
			current.date = l;
			return;
		}
		// If looks like a new item (degree-like), push and start new
		if (/(Bachelor|Master|B\.?Sc\.?|M\.?Sc\.?|B\.?Eng\.?|M\.?Eng\.?|Diploma)/i.test(l)){
			items.push(current);
			current = { degree: l, institution: '', date: '', notes: '' };
			return;
		}
		current.notes += (current.notes ? '\n' : '') + l;
	});
	if (current) items.push(current);
	return items;
}

async function main(){
	const filePath = process.argv[2];
	if (!filePath || !fs.existsSync(filePath)){
		console.error('PDF not found:', filePath);
		process.exit(1);
	}
	const dataBuffer = fs.readFileSync(filePath);
	const { text } = await pdf(dataBuffer);
	const lines = splitLines(text);

	const header = (s) => new RegExp('^\n*\s*' + s + '\s*$', 'i');
	const stopHeaders = [
		/^(skills?|technical skills?)$/i,
		/^projects?$/i,
		/^experience$/i,
		/^education$/i,
		/^certifications?$/i,
		/^awards?$/i,
		/^activities$/i,
		/^publications?$/i
	];

	const summaryText = findSection(lines, /^(professional\s+summary|summary)$/i, stopHeaders);
	const experienceText = findSection(lines, /^experience$/i, stopHeaders);
	const educationText = findSection(lines, /^education$/i, stopHeaders);

	const result = {
		professionalSummary: summaryText || '',
		experience: parseExperience(experienceText),
		education: parseEducation(educationText)
	};

	process.stdout.write(JSON.stringify(result, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });


