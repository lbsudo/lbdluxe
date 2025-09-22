import * as React from 'react';

interface EmailTemplateProps {
    firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
    return (
        <div>
            <h1>Welcome, {firstName}!</h1>
            <p>This email is a confirmation email to. Please click the button below to verify your email address</p>
            <button>Verify Email</button>
        </div>
    );
}