# What I Learned from My First Kaggle Competition

*A post-mortem on the Titanic survival prediction challenge.*

---

## Background

The Titanic competition on Kaggle is the canonical "Hello World" of data science. You get passenger data — name, age, sex, ticket class — and your job is to predict who survived.

I knew the basics of Pandas and had done a few Scikit-learn tutorials. This was my first time taking a model through the whole pipeline from raw data to submission.

---

## What I Did Right

### 1. Spending Time on EDA First

I spent the first two hours just *looking at the data* before writing a single line of model code. Using Seaborn heatmaps and barplots, I noticed immediately that:

- **Sex was a very strong predictor** — women had a much higher survival rate
- **Pclass mattered** — 1st class passengers survived more
- **Age had a lot of missing values** (177 out of 891)

Taking this time to understand the data before modelling was the right call.

### 2. Feature Engineering

Instead of just throwing raw columns at the model, I created new features:

```python
# Family size from SibSp (siblings/spouse) + Parch (parents/children) 
df['FamilySize'] = df['SibSp'] + df['Parch'] + 1

# Solo traveller flag
df['IsAlone'] = (df['FamilySize'] == 1).astype(int)

# Extract title from name (Mr, Mrs, Miss, Master, Rare)
df['Title'] = df['Name'].str.extract(r' ([A-Za-z]+)\.', expand=False)
```

The `Title` feature was the most impactful — it encoded information about age, sex, and social status simultaneously.

---

## What I Got Wrong

### 1. I Started With a Complex Model

My first instinct was to jump to XGBoost because I'd heard it was "the best". Big mistake. I spent hours tuning hyperparameters on a model I didn't understand, getting mediocre results.

When I went back and started with a simple Decision Tree, I understood *why* certain features mattered. Then moving to Random Forest made sense as a natural improvement.

**Lesson: Start simple. Understand before you optimise.**

### 2. I Ignored Cross-Validation Initially

I split the data once (80/20 train/test) and tuned based on that single split. My public leaderboard score was significantly different from my local test score.

Cross-validation (k-fold) gives you a more reliable estimate by training and validating on multiple splits.

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
print(f"Mean: {scores.mean():.3f} ± {scores.std():.3f}")
```

**Lesson: Cross-validate everything before you submit.**

---

## Final Result

Public leaderboard: **0.80143** — top 15% of ~15,000 entries.

Not bad for a first attempt. I learned more from this competition than from 3 weeks of tutorials.

---

## What I'd Do Differently

1. Start with EDA and feature engineering, not model selection
2. Use cross-validation from day one
3. Read other people's notebooks *after* submitting, not before — it ruins the learning experience if you read them first

---

*Next up: attempting the House Prices competition, which involves regression instead of classification.*
