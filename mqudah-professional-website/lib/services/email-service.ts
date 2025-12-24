export class EmailService {
    async sendWorkshopConfirmation(user: any, workshop: any) {
        // Mock Email implementation (e.g. Resend)
        console.log(`[Email] Sending confirmation to ${user.email} for workshop ${workshop.title}`);
        return true;
    }
}
