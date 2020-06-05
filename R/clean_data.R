# visit these URLs
# https://www.bop.gov/resources/pdfs/wsipp_cost-benefit_summary.pdf
# https://www.newamerica.org/in-depth/care-report/policy-recommendations-universal-pre-k/
# https://www.npr.org/2019/07/10/738506646/student-debt-forgiveness-sounds-good-what-might-happen-if-the-government-did-it#:~:text=Americans%20owe%20about%20%241.6%20trillion,on%20a%20federal%20student%20loan.
# https://www.nursefamilypartnership.org/wp-content/uploads/2017/02/Miller-State-Specific-Fact-Sheet_US_20170405.pdf
# https://www.cbo.gov/system/files/2018-11/54690-presentation_0.pdf
# https://frac.org/wp-content/uploads/cnnslp.pdf
# http://cdn.cnn.com/cnn/2020/images/04/16/shopp.covid.ppd.costs.analysis_.pdf

library(tidyverse)
library(here)

# data is from https://www.taxpolicycenter.org/statistics/state-and-local-general-expenditures-capita
data_raw <-
  readxl::read_excel(here("data/data_raw.xls"), skip = 7)

data_raw <- data_raw[c(1:2, 10, 12)]

colnames(data_raw) <-
  c('state', 'spending_total_pc', 'spending_police_pc', 'pop')

non_state_cols <- c(
  'United States',
  'New England',
  'Mideast',
  'Great Lakes',
  'Plains',
  'Southeast',
  'Southwest',
  'Rocky Mountain',
  'Far West [2]'
)


data_clean <- data_raw %>%
  filter(!is.na(state)) %>%
  filter(!state %in% non_state_cols)

data_final <- data_clean %>%
  mutate(
    pop = pop * 1000,
    spending_total_total = spending_total_pc * pop,
    spending_police_total = spending_police_pc * pop
  )

data_final <- data_final[1:51, ]

write.csv(data_final, here('data/data_clean.csv'))
