# Order form setup — Google Sheet + WhatsApp confirm

Your site is static (GitHub Pages), so the form needs a free backend to save
submissions. This uses Google Apps Script (free, runs on Google's servers) to
append every order to a Google Sheet. After saving, the customer is shown a
"Confirm Order on WhatsApp" button with their order details pre-filled —
so you get notified the moment they tap send, and the full record is in
your Sheet either way.

Total setup time: ~5 minutes, one time only.

---

## Step 1 — Create the Google Sheet (done if you already made one)

In row 1, these column headers, in this order:
`Timestamp | Name | Phone | Area | Date | Order Details | Address | Notes`

## Step 2 — Add the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete any starter code, paste this in:

```javascript
const SHEET_NAME = 'Sheet1'; // change only if your tab isn't named "Sheet1"
const SECRET_KEY = '8b356999d2a7bb85f934f05518f0f5fe'; // must match ORDER_FORM_SECRET in script.js

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  // reject anything without our secret — blocks random bots that find the URL
  if (data.secret !== SECRET_KEY) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'forbidden' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    data.area || '',
    data.date || '',
    data['order-details'] || '',
    data.address || '',
    data.notes || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click the **disk icon** (Save)

> If you ever need to rotate this secret, change `SECRET_KEY` here AND
> `ORDER_FORM_SECRET` in `script.js` to the same new value, then redeploy
> (see "If you ever edit the script" below) and push the site change.

## Step 3 — Deploy as a Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Settings:
   - Description: `Order form handler`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Authorize when prompted (click through the "unsafe" warning — it's your own script)
6. Copy the **Web app URL** it gives you (ends in `/exec`)

## Step 4 — Connect it to your site

Open `script.js` and find these two lines near the top of the "Order form" section:

```js
const ORDER_FORM_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
const BUSINESS_WHATSAPP_NUMBER = '31XXXXXXXXX';
```

- Replace `ORDER_FORM_SCRIPT_URL` with the Web app URL from Step 3
- Replace `BUSINESS_WHATSAPP_NUMBER` with your real WhatsApp number (country code, no `+`, no spaces — e.g. `31612345678`)

Then commit and push:
```
git add script.js
git commit -m "Connect order form to Google Sheet"
git push
```

That's it. Test it on your live site: submit the form, check that a new row
appears in your Sheet, then tap "Confirm Order on WhatsApp" on the success
screen — it should open WhatsApp with the full order pre-typed, ready to send
to you.

---

### If you ever edit the script

Apps Script Web App URLs only update if you create a **new deployment version**:
**Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy**
(this reuses the same URL — no need to update `script.js` again).
