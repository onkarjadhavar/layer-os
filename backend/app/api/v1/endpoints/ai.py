import uuid
from typing import Optional
import httpx
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.session import get_db
from app.core.config import settings
from app.schemas.ai import AskAIInput, AIResponse
from app.models.record import DailyRecord

router = APIRouter()


def generate_rule_based_advisory(
    query: str,
    lang: str = "mr",
    farm_id: Optional[uuid.UUID] = None,
    db: Optional[Session] = None
) -> str:
    q = query.lower()

    latest_rec = None
    if farm_id and db:
        latest_rec = (
            db.query(DailyRecord)
            .filter(DailyRecord.farm_id == farm_id)
            .order_by(desc(DailyRecord.record_date))
            .first()
        )

    if "mortality" in q or "मृत्यू" in q:
        if latest_rec:
            mort_count = latest_rec.mortality
            mort_pct = round((mort_count / latest_rec.opening_birds * 100), 2) if latest_rec.opening_birds else 0.0
            if lang == "mr":
                return (
                    f"**मृत्यूदर (Mortality) विश्लेषण व सल्ला:**\n\n"
                    f"१. आजचा प्रत्यक्ष मृत्यूदर {mort_pct}% ({mort_count} पक्षी) आहे.\n"
                    "२. **कृती**: शेडमधील पाणी प्रेशर (Water Nipples) नियमित तपासा आणि मृत पक्षांचे पोस्टमार्टम (PM) करा.\n"
                    "३. उन्हाळा असल्यास दुपारी १२ ते ४ व्हिटॅमिन सी आणि इलेक्ट्रोल (ORS) पाण्यातून द्या."
                )
            else:
                return (
                    f"**Mortality Analysis & Advice:**\n\n"
                    f"1. Today's recorded mortality is {mort_pct}% ({mort_count} birds).\n"
                    "2. **Action**: Check water nipple line pressure across all tiers and conduct routine post-mortem.\n"
                    "3. In high ambient temperatures, supplement drinking water with Vitamin C and electrolytes between 12 PM - 4 PM."
                )
        else:
            if lang == "mr":
                return (
                    "**मृत्यूदर (Mortality) मार्गदर्शक तत्त्वे:**\n\n"
                    "१. BV-300 मानकांनुसार दैनिक मृत्यूदर ०.०५% च्या आत असणे आवश्यक आहे.\n"
                    "२. **कृती**: शेडमधील पाण्याचे प्रेशर आणि व्हेंटिलेशन तपासा. कोणतीही लक्षणे आढळल्यास तातडीने पशुवैद्यकांशी संपर्क साधा.\n"
                    "३. अचूक विश्लेषणासाठी कृपया दैनिक नोंदी (Daily Records) भरा."
                )
            else:
                return (
                    "**Mortality Guidelines & Advisory:**\n\n"
                    "1. Under BV-300 standards, daily mortality should be maintained below 0.05%.\n"
                    "2. **Action**: Check waterline pressure and shed ventilation. In case of sudden spikes, consult your poultry veterinarian.\n"
                    "3. Add daily records to get real-time flock-specific mortality analysis."
                )

    if "feed" in q or "खुराक" in q:
        if latest_rec:
            feed_g = float(latest_rec.feed_per_bird_g)
            feed_kg = float(latest_rec.feed_issued_kg)
            feed_bags = round(feed_kg / 50.0, 1)
            if lang == "mr":
                return (
                    f"**खुराक (Feed Intake) विश्लेषण व शिफारस:**\n\n"
                    f"१. नोंदवलेला सरासरी खुराक प्रति पक्षी {feed_g} ग्रॅम (एकूण {feed_kg} किलो / ~{feed_bags} पोती) आहे.\n"
                    "२. **कृती**: लेयर पक्षांसाठी ११०-११२ ग्रॅम हा प्रमाण खुराक आहे. सकाळी ६:३० वाजता खाद्य द्या.\n"
                    "३. शेडचे तापमान वाढण्यापूर्वी खाद्य देणे पूर्ण करा."
                )
            else:
                return (
                    f"**Feed Intake Analysis & Recommendations:**\n\n"
                    f"1. Recorded feed intake is {feed_g} g/bird (total {feed_kg} kg / ~{feed_bags} bags).\n"
                    "2. **Action**: For peak laying birds, 110-112 g/bird is standard. Maintain early morning feeding.\n"
                    "3. Complete morning feeding before ambient temperature rises."
                )
        else:
            if lang == "mr":
                return (
                    "**खुराक (Feed Management) मार्गदर्शक तत्त्वे:**\n\n"
                    "१. व्यावसायिक लेयर पक्षांसाठी दररोज ११० ते ११५ ग्रॅम प्रति पक्षी खाद्य आवश्यक असते.\n"
                    "२. **कृती**: दररोज सकाळी ६:३० वाजता पहिली फीडिंग द्या आणि पाण्याची उपलब्धता तपासा.\n"
                    "३. अचूक दैनिक खप ट्रॅक करण्यासाठी रोजची खुराक नोंद करा."
                )
            else:
                return (
                    "**Feed Management Guidelines:**\n\n"
                    "1. Commercial layer standard requirement is 110-115 g/bird/day.\n"
                    "2. **Action**: Administer early morning feeding and ensure uninterrupted clean water supply.\n"
                    "3. Log daily feed issues to monitor feed conversion efficiency."
                )

    # General poultry advice
    if latest_rec:
        hd = float(latest_rec.hd_pct)
        eggs = latest_rec.total_eggs_collected
        if lang == "mr":
            return (
                f"**LayerOS AI दैनिक सल्लागार:**\n\n"
                f"१. **अंडी उत्पादन (HD%)**: नोंदवलेले उत्पादन {hd}% असून एकूण {eggs:,} अंडी गोळा झाली आहेत.\n"
                "२. **व्यवस्थापन**: शेडमधील तापमान व स्वच्छता नियमित ठेवा.\n"
                "३. **बाजार सल्ला**: स्थानिक मंडी दरांचा आढावा घेऊन अंडी विक्रीचे नियोजन करा."
            )
        else:
            return (
                f"**LayerOS AI Daily Advisory:**\n\n"
                f"1. **Production (HD%)**: Recorded production is {hd}% with {eggs:,} eggs collected.\n"
                "2. **Management**: Monitor shed temperature and maintain biosecurity protocols.\n"
                "3. **Market Advice**: Review local mandi rates to optimize daily sales scheduling."
            )
    else:
        if lang == "mr":
            return (
                "**LayerOS AI सल्लागार:**\n\n"
                "१. **उत्पादन लक्ष्य**: व्यावसायिक लेयर पोल्ट्रीमध्ये ९०%+ HD उत्पादन आणि ०.०५% खाली मृत्यूदर राखणे फायदेशीर ठरते.\n"
                "२. **दैनिक नोंद**: अचूक नफा-तोटा आणि उत्पादकता विश्लेषणासाठी कृपया आजची दैनिक नोंद करा.\n"
                "३. **बाजार दर**: दैनंदिन स्थानिक मंडी दरांवर लक्ष ठेवा."
            )
        else:
            return (
                "**LayerOS AI Advisory:**\n\n"
                "1. **Production Target**: Aim for 90%+ Hen-Day production and <0.05% mortality for peak profitability.\n"
                "2. **Daily Logging**: Log daily collections and feed intake to unlock real-time predictive analytics.\n"
                "3. **Market Rates**: Check the Mandi Rates tab for today's realized pricing."
            )


@router.post("/advisor", response_model=AIResponse)
async def ask_ai_advisor(
    input_data: AskAIInput,
    db: Session = Depends(get_db)
):
    # Try zero-cost FreeLLMAPI local proxy if available
    if settings.FREELLMAPI_BASE_URL:
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.post(
                    f"{settings.FREELLMAPI_BASE_URL}/chat/completions",
                    json={
                        "model": "auto",
                        "messages": [
                            {"role": "system", "content": "You are LayerOS Poultry Expert AI for commercial layer farms in Maharashtra, India. Respond concisely with exact figures."},
                            {"role": "user", "content": f"Language: {input_data.language}. Query: {input_data.query}"}
                        ]
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                    if content:
                        return AIResponse(
                            success=True,
                            source="freellmapi",
                            model="FreeLLMAPI-Auto",
                            badge="FreeLLMAPI (Zero-Cost AI)",
                            text=content,
                            disclaimer="ही माहिती AI मॉडेलने तयार केली आहे. अंतिम निर्णयापूर्वी पशुवैद्यकीय सल्ला घ्या."
                        )
        except Exception:
            pass

    # Deterministic rule-based poultry expert heuristic fallback
    text_content = generate_rule_based_advisory(
        input_data.query,
        input_data.language,
        farm_id=input_data.farm_id,
        db=db
    )
    return AIResponse(
        success=True,
        source="rule_based",
        model="layeros-poultry-expert-v1",
        badge="पोल्ट्री तज्ज्ञ अल्गोरिदम (Expert Heuristics)",
        text=text_content,
        disclaimer="ही माहिती BV-300 पोल्ट्री मार्गदर्शक तत्त्वांनुसार विश्लेषित केली आहे."
    )
