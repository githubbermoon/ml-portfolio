# Kosh Dispatches setup

The website code never sends a broadcast. A free GitHub workflow creates an unsent Buttondown draft when a publication record is added or enabled. Sending always happens manually inside Buttondown.

1. Create the newsletter **Kosh Dispatches** in Buttondown.
2. Set its description to **New writings and pages from Kosh.**
3. Set the reply-to address to `pranjalprakashpandey1@gmail.com` and keep double opt-in enabled.
4. The site defaults to the confirmed username `kosh-dispatches`. `PUBLIC_BUTTONDOWN_USERNAME` remains available as an optional override.
5. In Buttondown, open **API → Keys** and create a key with **Email: write** and **Sending: none**. This restriction lets GitHub create and edit drafts but prevents it from sending them.
6. In the GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret**. Name it `BUTTONDOWN_API_KEY` and paste the key.
7. Do not enable RSS-to-email; it is a paid feature and is not used by this integration.
8. Publish a temporary registry record with **Announce this work** enabled and confirm that the GitHub action creates one draft in Buttondown.
9. Send a preview to the owner. Send to subscribers only after reviewing the subject, text, image, links, and recipient count in Buttondown.

New announcements are added in Pages CMS under **Kosh Dispatches publications**. A record appears in the RSS feed only when **Announce this work** is enabled.

The public `/dispatches.xml` feed remains available for ordinary RSS readers, but Buttondown does not need to consume it.
