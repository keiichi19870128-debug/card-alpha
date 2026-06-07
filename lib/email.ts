import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@card-alpha.jp";

export async function sendPriceAlertEmail(params: {
  to: string;
  cardName: string;
  currentPrice: number;
  targetPrice: number;
  condition: "above" | "below";
}) {
  const { to, cardName, currentPrice, targetPrice, condition } = params;
  const conditionText = condition === "below" ? "以下" : "以上";

  try {
    await resend.emails.send({
      from: `Card Alpha <${FROM_EMAIL}>`,
      to,
      subject: `【価格アラート】${cardName}が目標価格に到達しました`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Card Alpha 価格アラート</h2>
          <p>設定されたアラート条件に達しました。</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">カード名</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${cardName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">現在価格</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #22c55e;">¥${currentPrice.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">目標価格</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">¥${targetPrice.toLocaleString()} ${conditionText}</td>
            </tr>
          </table>
          <p style="color: #666; font-size: 12px;">
            このメールはCard Alphaの価格アラート機能により自動送信されています。<br/>
            アラート設定はマイページから変更できます。
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmail(params: { to: string; name: string }) {
  try {
    await resend.emails.send({
      from: `Card Alpha <${FROM_EMAIL}>`,
      to: params.to,
      subject: "Card Alphaへようこそ！",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">ようこそ、${params.name || ""}さん！</h2>
          <p>Card Alphaへの登録ありがとうございます。</p>
          <p>Card Alphaでは以下の機能をご利用いただけます：</p>
          <ul>
            <li>注目カードの価格推移チェック</li>
            <li>予算別投資戦略の確認</li>
            <li>高騰・下落ランキング</li>
            <li>AI分析スコアの確認</li>
          </ul>
          <p>さっそくサイトを確認してみましょう！</p>
          <a href="https://card-alpha.jp" style="display: inline-block; padding: 12px 24px; background: #22c55e; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Card Alphaを見る
          </a>
        </div>
      `,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error: error.message };
  }
}
