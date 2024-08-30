import { error } from '@sveltejs/kit';

// Type(s)
type ErrorStatusCodes =
    | 401
    | 403
    | 404
    | 422
    | 429
    | 500;

const ERROR_CODES_BY_KEY = {
	MISSING_API_KEY: 401,
	INVALID_API_KEY: 403,
	NOT_FOUND: 404,
	INVALID_REQUEST: 422,
	PLAN_LIMIT_EXCEEDED: 429,
	RATE_LIMIT_EXCEEDED: 429,
	INTERNAL_SERVER_ERROR: 500
} as const;

type ErrorCodeKey = keyof typeof ERROR_CODES_BY_KEY;

// Type(s)
type ErrorCode = ErrorCodeKey;

// Interface(s)
interface ErrorResponse {
	code: ErrorCode;
	message: string;
}

// Function
export function handleError(code: ErrorCode) {
	const status: ErrorStatusCodes = ERROR_CODES_BY_KEY[code] || 500;

	const res: ErrorResponse = {
		code,
		message: 'An internal server error occurred.'
	};

	switch (code) {
		case 'PLAN_LIMIT_EXCEEDED':
			res.message = 'You have reached your plan sending quota.';
			break;
		case 'MISSING_API_KEY':
			res.message = 'Missing API key in the authorization header.';
			break;
		case 'INVALID_API_KEY':
			res.message = 'The API key is not valid.';
			break;
		case 'NOT_FOUND':
			res.message = 'The requested endpoint does not exist.';
			break;
		case 'RATE_LIMIT_EXCEEDED':
			res.message = 'You have exceeded maximum number of requests per second.';
			break;
		case 'INVALID_REQUEST':
			res.message = 'The request body is invalid.';
			break;
		default:
			res.message = 'An internal server error occurred.';
	}

	return error(status, res);
}

export function throwError(input: ErrorCode | unknown) {
	let code: ErrorCode = 'INTERNAL_SERVER_ERROR';

	if (typeof input === 'string') {
		code = input as ErrorCode;
	} else if (input instanceof Error) {
		if (input.message === 'Unexpected end of JSON input') {
			code = 'INVALID_REQUEST';
		}
	}

	return handleError(code);
}
