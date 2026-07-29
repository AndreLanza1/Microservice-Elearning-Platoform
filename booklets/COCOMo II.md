# COCOMO II Analysis
COCOMO II (Constructive Cost Model II) is a software cost estimation model that uses Function Points (FP) or Source Lines of Code (SLOC) to estimate effort, schedule, and cost. 

Based on the 285 Function Points computed during the [Function Points Analysis]((https://github.com/chiara01712/1988552_SPARK/edit/main/booklets/)), we will perform a COCOMO II analysis to estimate the effort required for our learinig
platform Spark.

## Convert Function Points to SLOC

COCOMO II typically uses Source Lines of Code (SLOC) for estimation. For a mixed-language project (JS, HTML, CSS), we can use the following average SLOC per FP values:

JavaScript: 53 SLOC/FP

HTML/CSS: 40 SLOC/FP


Assuming the project is distributed as
| Language    | Distribution (%) | SLOC/FP |
|-------------|-----------------:|--------:|
| JavaScript  | 49.43 %          | 53      |
| CSS         | 43.17 %          | 40      |
| HTML        | 7.40 %           | 40      |
| **Weighted Average** | —               | **46** |

the average SLOC/FP is approximately 46 SLOC/FP.

Total SLOC: 285 FP × 46 SLOC/FP = 13.110 SLOC.

## COCOMO II Parameters

COCOMO II uses the following formula to estimate effort:

$$\text{Effort}=A\times \text{SLOC}^{E} \times \prod_{i=1}^nEM_i$$

Where:

$A$ = 2.94 (for COCOMO II)

$E$ = Exponent (depends on project scale factors)

$EM_i$​ = Effort Multipliers (based on cost drivers)

### Scale Factors (SF)

Scale factors account for project complexity. For this project, we assume the following values:

Scale Factor|Rating|Value
---|---|---
Precedentedness (PREC) |	Low (new project) |	4.96
Development Flexibility (FLEX)	| High (flexible requirements)	| 2.03
Architecture/Risk Resolution (RESL)	| High (good risk management)	| 2.83
Team Cohesion (TEAM)	| High (experienced team)	| 2.19
Process Maturity (PMAT)	| High (well-defined process)	| 3.12

Total Scale Factor (SF): Sum of all scale factors = 15.13

Exponent (E):  $E=0.91+0.01×SF=0.91+0.01×15.13=1.0613$

### Effort Multipliers (EM)

Effort multipliers adjust the effort based on cost drivers. For this project, we assume the following values:

Cost Driver|Rating|Value
---|---|---
Required Software Reliability (RELY)|High (reliable system)|1.10
Database Size (DATA)|Nominal (moderate database size)|1.00
Product Complexity (CPLX)|High (moderate complexity)|1.17
Required Reusability (RUSE)|Nominal (some reuse)|1.00
Documentation Match to Lifecycle Needs (DOCU)|High (good documentation)|1.11
Execution Time Constraint (TIME)|Nominal (no strict constraints)|1.00
Storage Constraint (STOR)|Nominal (no strict constraints)|1.00
Platform Volatility (PVOL)|Low (stable platform)|0.87
Analyst Capability (ACAP)|High (experienced analysts)|0.85
Programmer Capability (PCAP)|High (experienced developers)|0.88
Personnel Continuity (PCON)|High (low turnover)|0.81
Application Experience (APEX)|High (experienced team)|0.88
Platform Experience (PLEX)|High (experienced with platform)|0.85
Language and Tool Experience (LTEX)|High (experienced with tools)|0.88
Use of Software Tools (TOOL)|High (good tool support)|0.90
Multisite Development (SITE)|Nominal (single site)|1.00
Required Development Schedule (SCED)|Nominal (no schedule compression)|1.00

Total Effort Multiplier (EM): Product of all EM values = 0.38

### Effort Estimation

Using the COCOMO II formula:

$$\text{Effort}=2.94 \times \text{SLOC}^{1.0613} \times EM$$

$$\text{Effort}=2.94 \times 13,110^{1.0613} \times 0.38$$

$$\text{Effort} \approx 26,190 \text{ person-hours}$$

Effort in Person-Months: Assuming 152 working hours per month (8 hours/day × 19 days/month), the effort is:

$$\text{Effort}=\frac{26,190}{152} \approx 172 \text{ person-months}$$


