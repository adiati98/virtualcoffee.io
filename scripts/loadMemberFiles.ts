import fs from 'fs';
import path from 'path';

function loadMemberFiles(dir: string) {
	const filenames: string[] = [];

	fs.readdirSync(path.join('.', 'src', 'content', 'members', dir), {
		withFileTypes: true,
	}).forEach((file) => {
		if (
			file.isFile() &&
			file.name.endsWith('.ts') &&
			file.name !== '_EXAMPLE.ts'
		) {
			filenames.push(file.name.replace('.ts', ''));
		}
	});

	fs.writeFileSync(
		path.join('.', 'src', 'data', 'members', `${dir}.ts`),
		filenames
			.map(
				(name) => `export * from '@/content/members/${dir}/${name}';`,
				'utf8',
			)
			.join('\n'),
		'utf8',
	);
}

loadMemberFiles('core');
loadMemberFiles('members');
