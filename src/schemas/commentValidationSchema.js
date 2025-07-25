import * as yup from 'yup';

export const commentValidationSchema = yup.object({
    comment_text: yup
        .string()
        .required('Comment text is required')
        .test(
            'not-only-whitespace',
            'Comment text cannot be empty or only whitespace',
            (value) => value.trim().length > 0
        )
        .min(4, 'Comment text must be at least 4 character long')
        .max(500, 'Comment text must not exceed 500 characters'),
        
});
