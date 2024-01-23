// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface User {
			email: string;
			name: string;
			id: number;
			iat: number;
			exp: number;
		}

		// interface Error {}
		interface Locals {
			user?: User;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
