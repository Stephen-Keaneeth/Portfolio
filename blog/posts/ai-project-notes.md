# Building My First ML App — Lessons from Smart Health AI

*Notes on going from a Jupyter notebook to a deployed Streamlit app.*

---

## The Starting Point

I had a working notebook. The model predicted diseases from symptoms with decent accuracy. The problem: only I could run it. If you didn't have Python, Scikit-learn, and my specific dataset installed on your machine, it was useless.

The goal: **make it work in a browser, for anyone, with no setup.**

---

## Choosing Streamlit

My options were to build a Flask web app, a FastAPI backend + React frontend, or use Streamlit.

Streamlit won instantly. It lets you write a Python script that *becomes* a web app. No JavaScript, no HTML, no CSS required. For a first deployment, this was the right call.

```python
import streamlit as st
import pickle

# Load the trained model
model = pickle.load(open('model.pkl', 'rb'))

st.title("Smart Health AI")
symptoms = st.multiselect("Select Symptoms", options=SYMPTOM_LIST)

if st.button("Predict") and symptoms:
    prediction = model.predict([encode(symptoms)])
    st.success(f"Most likely condition: {prediction[0]}")
```

That's a working app in 10 lines.

---

## Mistakes I Made

### 1. I Didn't Handle the Edge Cases

The model crashed if you submitted zero symptoms. I had no validation. Fix:

```python
if st.button("Predict"):
    if not symptoms:
        st.warning("Please select at least one symptom.")
    else:
        prediction = model.predict([encode(symptoms)])
```

Always validate user input before passing it to any model.

### 2. I Committed the Dataset to Git

The dataset was 8MB. Git repositories are better with large files in `.gitignore` or stored in a separate location. I learned about `.gitignore` the hard way after a slow push.

```
# .gitignore
*.csv
*.pkl
__pycache__/
```

### 3. Model Overconfidence

The original app showed the #1 prediction with 100% confidence even when the model was actually 45% sure. This is dangerous in a health context. Fix:

```python
probabilities  = model.predict_proba([encode(symptoms)])[0]
top3_idx       = probabilities.argsort()[-3:][::-1]
for idx in top3_idx:
    st.write(f"{CLASSES[idx]} — {probabilities[idx]*100:.1f}% confidence")
```

Always show the top-N predictions with actual confidence scores. Don't let your app be more confident than your model is.

---

## What I'd Do Differently

1. **Start with the app structure first, then the model** — knowing how the data will flow in the UI shapes better model design decisions
2. **Write a `requirements.txt` from day one** — `pip freeze > requirements.txt` is your future self's best friend
3. **Separate concerns** — keep model loading, preprocessing, and UI in separate files, not one giant `app.py`

---

## Final Architecture

```
smart-health-ai/
├── app.py              # Streamlit UI
├── model.py            # Model loading + prediction logic
├── preprocessing.py    # Symptom encoding / decoding
├── train.py            # Training script (run once)
├── model.pkl           # Saved trained model (in .gitignore)
├── requirements.txt
└── README.md
```

This separation made debugging much faster. When the UI broke, I only looked in `app.py`. When predictions were wrong, I looked in `model.py` or `preprocessing.py`.

---

*Source code on [GitHub](https://github.com/YOUR_GITHUB/smart-health-ai).*
