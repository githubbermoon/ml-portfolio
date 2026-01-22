import { useEffect, useState } from 'react';

type Props = {
	password: string;
	targetId?: string;
	expiresHours?: number;
};

const STORAGE_KEY = 'blog-gate-until';

const isUnlocked = () => {
	const until = sessionStorage.getItem(STORAGE_KEY);
	if (!until) return false;
	return Number(until) > Date.now();
};

export default function BlogGate({ password, targetId = 'blog-root', expiresHours = 12 }: Props) {
	const [ready, setReady] = useState(false);
	const [value, setValue] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		const root = document.getElementById(targetId);
		if (!root) return;
		if (isUnlocked()) {
			root.classList.remove('blog-locked');
			root.classList.add('blog-unlocked');
		}
		setReady(true);
	}, [targetId]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (value !== password) {
			setError('Incorrect password');
			return;
		}
		setError('');
		const until = Date.now() + expiresHours * 60 * 60 * 1000;
		sessionStorage.setItem(STORAGE_KEY, String(until));
		const root = document.getElementById(targetId);
		if (root) {
			root.classList.remove('blog-locked');
			root.classList.add('blog-unlocked');
		}
	};

	if (!ready) return null;

	return (
		<div className="glass-panel mx-auto w-full max-w-md p-6 text-center">
			<p className="text-xs uppercase tracking-[0.3em] text-mist">Private</p>
			<h2 className="mt-3 text-2xl text-glass">Enter password</h2>
			<form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
				<input
					className="rounded-full border border-mist/30 bg-glass/5 px-4 py-3 text-sm text-glass placeholder:text-mist/70"
					type="password"
					autoComplete="current-password"
					value={value}
					onChange={(event) => setValue(event.target.value)}
					placeholder="Password"
				/>
				<button
					type="submit"
					className="rounded-full border border-mist/40 px-4 py-3 text-sm text-glass transition hover:border-glass/50"
				>
					Unlock
				</button>
			</form>
			{error && <p className="mt-3 text-xs text-amber-400">{error}</p>}
		</div>
	);
}
