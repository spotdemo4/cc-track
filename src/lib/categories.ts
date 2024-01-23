export let categories = [
    {
        "PRIMARY": "INCOME",
        "DETAILED": "INCOME_DIVIDENDS",
        "DESCRIPTION": "Dividends from investment accounts"
    },
    {
        "PRIMARY": "INCOME",
        "DETAILED": "INCOME_INTEREST_EARNED",
        "DESCRIPTION": "Income from interest on savings accounts"
    },
    {
        "PRIMARY": "INCOME",
        "DETAILED": "INCOME_RETIREMENT_PENSION",
        "DESCRIPTION": "Income from pension payments"
    },
    {
        "PRIMARY": "INCOME",
        "DETAILED": "INCOME_TAX_REFUND",
        "DESCRIPTION": "Income from tax refunds"
    },
    {
        "PRIMARY": "INCOME",
        "DETAILED": "INCOME_UNEMPLOYMENT",
        "DESCRIPTION": "Income from unemployment benefits, including unemployment insurance and healthcare"
    },
    {
        "PRIMARY": "INCOME",
        "DETAILED": "INCOME_WAGES",
        "DESCRIPTION": "Income from salaries, gig-economy work, and tips earned"
    },
    {
        "PRIMARY": "INCOME",
        "DETAILED": "INCOME_OTHER_INCOME",
        "DESCRIPTION": "Other miscellaneous income, including alimony, social security, child support, and rental"
    },
    {
        "PRIMARY": "TRANSFER_IN",
        "DETAILED": "TRANSFER_IN_CASH_ADVANCES_AND_LOANS",
        "DESCRIPTION": "Loans and cash advances deposited into a bank account"
    },
    {
        "PRIMARY": "TRANSFER_IN",
        "DETAILED": "TRANSFER_IN_DEPOSIT",
        "DESCRIPTION": "Cash, checks, and ATM deposits into a bank account"
    },
    {
        "PRIMARY": "TRANSFER_IN",
        "DETAILED": "TRANSFER_IN_INVESTMENT_AND_RETIREMENT_FUNDS",
        "DESCRIPTION": "Inbound transfers to an investment or retirement account"
    },
    {
        "PRIMARY": "TRANSFER_IN",
        "DETAILED": "TRANSFER_IN_SAVINGS",
        "DESCRIPTION": "Inbound transfers to a savings account"
    },
    {
        "PRIMARY": "TRANSFER_IN",
        "DETAILED": "TRANSFER_IN_ACCOUNT_TRANSFER",
        "DESCRIPTION": "General inbound transfers from another account"
    },
    {
        "PRIMARY": "TRANSFER_IN",
        "DETAILED": "TRANSFER_IN_OTHER_TRANSFER_IN",
        "DESCRIPTION": "Other miscellaneous inbound transactions"
    },
    {
        "PRIMARY": "TRANSFER_OUT",
        "DETAILED": "TRANSFER_OUT_INVESTMENT_AND_RETIREMENT_FUNDS",
        "DESCRIPTION": "Transfers to an investment or retirement account, including investment apps such as Acorns, Betterment"
    },
    {
        "PRIMARY": "TRANSFER_OUT",
        "DETAILED": "TRANSFER_OUT_SAVINGS",
        "DESCRIPTION": "Outbound transfers to savings accounts"
    },
    {
        "PRIMARY": "TRANSFER_OUT",
        "DETAILED": "TRANSFER_OUT_WITHDRAWAL",
        "DESCRIPTION": "Withdrawals from a bank account"
    },
    {
        "PRIMARY": "TRANSFER_OUT",
        "DETAILED": "TRANSFER_OUT_ACCOUNT_TRANSFER",
        "DESCRIPTION": "General outbound transfers to another account"
    },
    {
        "PRIMARY": "TRANSFER_OUT",
        "DETAILED": "TRANSFER_OUT_OTHER_TRANSFER_OUT",
        "DESCRIPTION": "Other miscellaneous outbound transactions"
    },
    {
        "PRIMARY": "LOAN_PAYMENTS",
        "DETAILED": "LOAN_PAYMENTS_CAR_PAYMENT",
        "DESCRIPTION": "Car loans and leases"
    },
    {
        "PRIMARY": "LOAN_PAYMENTS",
        "DETAILED": "LOAN_PAYMENTS_CREDIT_CARD_PAYMENT",
        "DESCRIPTION": "Payments to a credit card. These are positive amounts for credit card subtypes and negative for depository subtypes"
    },
    {
        "PRIMARY": "LOAN_PAYMENTS",
        "DETAILED": "LOAN_PAYMENTS_PERSONAL_LOAN_PAYMENT",
        "DESCRIPTION": "Personal loans, including cash advances and buy now pay later repayments"
    },
    {
        "PRIMARY": "LOAN_PAYMENTS",
        "DETAILED": "LOAN_PAYMENTS_MORTGAGE_PAYMENT",
        "DESCRIPTION": "Payments on mortgages"
    },
    {
        "PRIMARY": "LOAN_PAYMENTS",
        "DETAILED": "LOAN_PAYMENTS_STUDENT_LOAN_PAYMENT",
        "DESCRIPTION": "Payments on student loans. For college tuition, refer to \"General Services - Education"
    },
    {
        "PRIMARY": "LOAN_PAYMENTS",
        "DETAILED": "LOAN_PAYMENTS_OTHER_PAYMENT",
        "DESCRIPTION": "Other miscellaneous debt payments"
    },
    {
        "PRIMARY": "BANK_FEES",
        "DETAILED": "BANK_FEES_ATM_FEES",
        "DESCRIPTION": "Fees incurred for out-of-network ATMs"
    },
    {
        "PRIMARY": "BANK_FEES",
        "DETAILED": "BANK_FEES_FOREIGN_TRANSACTION_FEES",
        "DESCRIPTION": "Fees incurred on non-domestic transactions"
    },
    {
        "PRIMARY": "BANK_FEES",
        "DETAILED": "BANK_FEES_INSUFFICIENT_FUNDS",
        "DESCRIPTION": "Fees relating to insufficient funds"
    },
    {
        "PRIMARY": "BANK_FEES",
        "DETAILED": "BANK_FEES_INTEREST_CHARGE",
        "DESCRIPTION": "Fees incurred for interest on purchases, including not-paid-in-full or interest on cash advances"
    },
    {
        "PRIMARY": "BANK_FEES",
        "DETAILED": "BANK_FEES_OVERDRAFT_FEES",
        "DESCRIPTION": "Fees incurred when an account is in overdraft"
    },
    {
        "PRIMARY": "BANK_FEES",
        "DETAILED": "BANK_FEES_OTHER_BANK_FEES",
        "DESCRIPTION": "Other miscellaneous bank fees"
    },
    {
        "PRIMARY": "ENTERTAINMENT",
        "DETAILED": "ENTERTAINMENT_CASINOS_AND_GAMBLING",
        "DESCRIPTION": "Gambling, casinos, and sports betting"
    },
    {
        "PRIMARY": "ENTERTAINMENT",
        "DETAILED": "ENTERTAINMENT_MUSIC_AND_AUDIO",
        "DESCRIPTION": "Digital and in-person music purchases, including music streaming services"
    },
    {
        "PRIMARY": "ENTERTAINMENT",
        "DETAILED": "ENTERTAINMENT_SPORTING_EVENTS_AMUSEMENT_PARKS_AND_MUSEUMS",
        "DESCRIPTION": "Purchases made at sporting events, music venues, concerts, museums, and amusement parks"
    },
    {
        "PRIMARY": "ENTERTAINMENT",
        "DETAILED": "ENTERTAINMENT_TV_AND_MOVIES",
        "DESCRIPTION": "In home movie streaming services and movie theaters"
    },
    {
        "PRIMARY": "ENTERTAINMENT",
        "DETAILED": "ENTERTAINMENT_VIDEO_GAMES",
        "DESCRIPTION": "Digital and in-person video game purchases"
    },
    {
        "PRIMARY": "ENTERTAINMENT",
        "DETAILED": "ENTERTAINMENT_OTHER_ENTERTAINMENT",
        "DESCRIPTION": "Other miscellaneous entertainment purchases, including night life and adult entertainment"
    },
    {
        "PRIMARY": "FOOD_AND_DRINK",
        "DETAILED": "FOOD_AND_DRINK_BEER_WINE_AND_LIQUOR",
        "DESCRIPTION": "Beer, Wine & Liquor Stores"
    },
    {
        "PRIMARY": "FOOD_AND_DRINK",
        "DETAILED": "FOOD_AND_DRINK_COFFEE",
        "DESCRIPTION": "Purchases at coffee shops or cafes"
    },
    {
        "PRIMARY": "FOOD_AND_DRINK",
        "DETAILED": "FOOD_AND_DRINK_FAST_FOOD",
        "DESCRIPTION": "Dining expenses for fast food chains"
    },
    {
        "PRIMARY": "FOOD_AND_DRINK",
        "DETAILED": "FOOD_AND_DRINK_GROCERIES",
        "DESCRIPTION": "Purchases for fresh produce and groceries, including farmers' markets"
    },
    {
        "PRIMARY": "FOOD_AND_DRINK",
        "DETAILED": "FOOD_AND_DRINK_RESTAURANT",
        "DESCRIPTION": "Dining expenses for restaurants, bars, gastropubs, and diners"
    },
    {
        "PRIMARY": "FOOD_AND_DRINK",
        "DETAILED": "FOOD_AND_DRINK_VENDING_MACHINES",
        "DESCRIPTION": "Purchases made at vending machine operators"
    },
    {
        "PRIMARY": "FOOD_AND_DRINK",
        "DETAILED": "FOOD_AND_DRINK_OTHER_FOOD_AND_DRINK",
        "DESCRIPTION": "Other miscellaneous food and drink, including desserts, juice bars, and delis"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_BOOKSTORES_AND_NEWSSTANDS",
        "DESCRIPTION": "Books, magazines, and news"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_CLOTHING_AND_ACCESSORIES",
        "DESCRIPTION": "Apparel, shoes, and jewelry"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_CONVENIENCE_STORES",
        "DESCRIPTION": "Purchases at convenience stores"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_DEPARTMENT_STORES",
        "DESCRIPTION": "Retail stores with wide ranges of consumer goods, typically specializing in clothing and home goods"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_DISCOUNT_STORES",
        "DESCRIPTION": "Stores selling goods at a discounted price"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_ELECTRONICS",
        "DESCRIPTION": "Electronics stores and websites"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_GIFTS_AND_NOVELTIES",
        "DESCRIPTION": "Photo, gifts, cards, and floral stores"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_OFFICE_SUPPLIES",
        "DESCRIPTION": "Stores that specialize in office goods"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_ONLINE_MARKETPLACES",
        "DESCRIPTION": "Multi-purpose e-commerce platforms such as Etsy, Ebay and Amazon"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_PET_SUPPLIES",
        "DESCRIPTION": "Pet supplies and pet food"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_SPORTING_GOODS",
        "DESCRIPTION": "Sporting goods, camping gear, and outdoor equipment"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_SUPERSTORES",
        "DESCRIPTION": "Superstores such as Target and Walmart, selling both groceries and general merchandise"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_TOBACCO_AND_VAPE",
        "DESCRIPTION": "Purchases for tobacco and vaping products"
    },
    {
        "PRIMARY": "GENERAL_MERCHANDISE",
        "DETAILED": "GENERAL_MERCHANDISE_OTHER_GENERAL_MERCHANDISE",
        "DESCRIPTION": "Other miscellaneous merchandise, including toys, hobbies, and arts and crafts"
    },
    {
        "PRIMARY": "HOME_IMPROVEMENT",
        "DETAILED": "HOME_IMPROVEMENT_FURNITURE",
        "DESCRIPTION": "Furniture, bedding, and home accessories"
    },
    {
        "PRIMARY": "HOME_IMPROVEMENT",
        "DETAILED": "HOME_IMPROVEMENT_HARDWARE",
        "DESCRIPTION": "Building materials, hardware stores, paint, and wallpaper"
    },
    {
        "PRIMARY": "HOME_IMPROVEMENT",
        "DETAILED": "HOME_IMPROVEMENT_REPAIR_AND_MAINTENANCE",
        "DESCRIPTION": "Plumbing, lighting, gardening, and roofing"
    },
    {
        "PRIMARY": "HOME_IMPROVEMENT",
        "DETAILED": "HOME_IMPROVEMENT_SECURITY",
        "DESCRIPTION": "Home security system purchases"
    },
    {
        "PRIMARY": "HOME_IMPROVEMENT",
        "DETAILED": "HOME_IMPROVEMENT_OTHER_HOME_IMPROVEMENT",
        "DESCRIPTION": "Other miscellaneous home purchases, including pool installation and pest control"
    },
    {
        "PRIMARY": "MEDICAL",
        "DETAILED": "MEDICAL_DENTAL_CARE",
        "DESCRIPTION": "Dentists and general dental care"
    },
    {
        "PRIMARY": "MEDICAL",
        "DETAILED": "MEDICAL_EYE_CARE",
        "DESCRIPTION": "Optometrists, contacts, and glasses stores"
    },
    {
        "PRIMARY": "MEDICAL",
        "DETAILED": "MEDICAL_NURSING_CARE",
        "DESCRIPTION": "Nursing care and facilities"
    },
    {
        "PRIMARY": "MEDICAL",
        "DETAILED": "MEDICAL_PHARMACIES_AND_SUPPLEMENTS",
        "DESCRIPTION": "Pharmacies and nutrition shops"
    },
    {
        "PRIMARY": "MEDICAL",
        "DETAILED": "MEDICAL_PRIMARY_CARE",
        "DESCRIPTION": "Doctors and physicians"
    },
    {
        "PRIMARY": "MEDICAL",
        "DETAILED": "MEDICAL_VETERINARY_SERVICES",
        "DESCRIPTION": "Prevention and care procedures for animals"
    },
    {
        "PRIMARY": "MEDICAL",
        "DETAILED": "MEDICAL_OTHER_MEDICAL",
        "DESCRIPTION": "Other miscellaneous medical, including blood work, hospitals, and ambulances"
    },
    {
        "PRIMARY": "PERSONAL_CARE",
        "DETAILED": "PERSONAL_CARE_GYMS_AND_FITNESS_CENTERS",
        "DESCRIPTION": "Gyms, fitness centers, and workout classes"
    },
    {
        "PRIMARY": "PERSONAL_CARE",
        "DETAILED": "PERSONAL_CARE_HAIR_AND_BEAUTY",
        "DESCRIPTION": "Manicures, haircuts, waxing, spa/massages, and bath and beauty products"
    },
    {
        "PRIMARY": "PERSONAL_CARE",
        "DETAILED": "PERSONAL_CARE_LAUNDRY_AND_DRY_CLEANING",
        "DESCRIPTION": "Wash and fold, and dry cleaning expenses"
    },
    {
        "PRIMARY": "PERSONAL_CARE",
        "DETAILED": "PERSONAL_CARE_OTHER_PERSONAL_CARE",
        "DESCRIPTION": "Other miscellaneous personal care, including mental health apps and services"
    },
    {
        "PRIMARY": "GENERAL_SERVICES",
        "DETAILED": "GENERAL_SERVICES_ACCOUNTING_AND_FINANCIAL_PLANNING",
        "DESCRIPTION": "Financial planning, and tax and accounting services"
    },
    {
        "PRIMARY": "GENERAL_SERVICES",
        "DETAILED": "GENERAL_SERVICES_AUTOMOTIVE",
        "DESCRIPTION": "Oil changes, car washes, repairs, and towing"
    },
    {
        "PRIMARY": "GENERAL_SERVICES",
        "DETAILED": "GENERAL_SERVICES_CHILDCARE",
        "DESCRIPTION": "Babysitters and daycare"
    },
    {
        "PRIMARY": "GENERAL_SERVICES",
        "DETAILED": "GENERAL_SERVICES_CONSULTING_AND_LEGAL",
        "DESCRIPTION": "Consulting and legal services"
    },
    {
        "PRIMARY": "GENERAL_SERVICES",
        "DETAILED": "GENERAL_SERVICES_EDUCATION",
        "DESCRIPTION": "Elementary, high school, professional schools, and college tuition"
    },
    {
        "PRIMARY": "GENERAL_SERVICES",
        "DETAILED": "GENERAL_SERVICES_INSURANCE",
        "DESCRIPTION": "Insurance for auto, home, and healthcare"
    },
    {
        "PRIMARY": "GENERAL_SERVICES",
        "DETAILED": "GENERAL_SERVICES_POSTAGE_AND_SHIPPING",
        "DESCRIPTION": "Mail, packaging, and shipping services"
    },
    {
        "PRIMARY": "GENERAL_SERVICES",
        "DETAILED": "GENERAL_SERVICES_STORAGE",
        "DESCRIPTION": "Storage services and facilities"
    },
    {
        "PRIMARY": "GENERAL_SERVICES",
        "DETAILED": "GENERAL_SERVICES_OTHER_GENERAL_SERVICES",
        "DESCRIPTION": "Other miscellaneous services, including advertising and cloud storage"
    },
    {
        "PRIMARY": "GOVERNMENT_AND_NON_PROFIT",
        "DETAILED": "GOVERNMENT_AND_NON_PROFIT_DONATIONS",
        "DESCRIPTION": "Charitable, political, and religious donations"
    },
    {
        "PRIMARY": "GOVERNMENT_AND_NON_PROFIT",
        "DETAILED": "GOVERNMENT_AND_NON_PROFIT_GOVERNMENT_DEPARTMENTS_AND_AGENCIES",
        "DESCRIPTION": "Government departments and agencies, such as driving licences, and passport renewal"
    },
    {
        "PRIMARY": "GOVERNMENT_AND_NON_PROFIT",
        "DETAILED": "GOVERNMENT_AND_NON_PROFIT_TAX_PAYMENT",
        "DESCRIPTION": "Tax payments, including income and property taxes"
    },
    {
        "PRIMARY": "GOVERNMENT_AND_NON_PROFIT",
        "DETAILED": "GOVERNMENT_AND_NON_PROFIT_OTHER_GOVERNMENT_AND_NON_PROFIT",
        "DESCRIPTION": "Other miscellaneous government and non-profit agencies"
    },
    {
        "PRIMARY": "TRANSPORTATION",
        "DETAILED": "TRANSPORTATION_BIKES_AND_SCOOTERS",
        "DESCRIPTION": "Bike and scooter rentals"
    },
    {
        "PRIMARY": "TRANSPORTATION",
        "DETAILED": "TRANSPORTATION_GAS",
        "DESCRIPTION": "Purchases at a gas station"
    },
    {
        "PRIMARY": "TRANSPORTATION",
        "DETAILED": "TRANSPORTATION_PARKING",
        "DESCRIPTION": "Parking fees and expenses"
    },
    {
        "PRIMARY": "TRANSPORTATION",
        "DETAILED": "TRANSPORTATION_PUBLIC_TRANSIT",
        "DESCRIPTION": "Public transportation, including rail and train, buses, and metro"
    },
    {
        "PRIMARY": "TRANSPORTATION",
        "DETAILED": "TRANSPORTATION_TAXIS_AND_RIDE_SHARES",
        "DESCRIPTION": "Taxi and ride share services"
    },
    {
        "PRIMARY": "TRANSPORTATION",
        "DETAILED": "TRANSPORTATION_TOLLS",
        "DESCRIPTION": "Toll expenses"
    },
    {
        "PRIMARY": "TRANSPORTATION",
        "DETAILED": "TRANSPORTATION_OTHER_TRANSPORTATION",
        "DESCRIPTION": "Other miscellaneous transportation expenses"
    },
    {
        "PRIMARY": "TRAVEL",
        "DETAILED": "TRAVEL_FLIGHTS",
        "DESCRIPTION": "Airline expenses"
    },
    {
        "PRIMARY": "TRAVEL",
        "DETAILED": "TRAVEL_LODGING",
        "DESCRIPTION": "Hotels, motels, and hosted accommodation such as Airbnb"
    },
    {
        "PRIMARY": "TRAVEL",
        "DETAILED": "TRAVEL_RENTAL_CARS",
        "DESCRIPTION": "Rental cars, charter buses, and trucks"
    },
    {
        "PRIMARY": "TRAVEL",
        "DETAILED": "TRAVEL_OTHER_TRAVEL",
        "DESCRIPTION": "Other miscellaneous travel expenses"
    },
    {
        "PRIMARY": "RENT_AND_UTILITIES",
        "DETAILED": "RENT_AND_UTILITIES_GAS_AND_ELECTRICITY",
        "DESCRIPTION": "Gas and electricity bills"
    },
    {
        "PRIMARY": "RENT_AND_UTILITIES",
        "DETAILED": "RENT_AND_UTILITIES_INTERNET_AND_CABLE",
        "DESCRIPTION": "Internet and cable bills"
    },
    {
        "PRIMARY": "RENT_AND_UTILITIES",
        "DETAILED": "RENT_AND_UTILITIES_RENT",
        "DESCRIPTION": "Rent payment"
    },
    {
        "PRIMARY": "RENT_AND_UTILITIES",
        "DETAILED": "RENT_AND_UTILITIES_SEWAGE_AND_WASTE_MANAGEMENT",
        "DESCRIPTION": "Sewage and garbage disposal bills"
    },
    {
        "PRIMARY": "RENT_AND_UTILITIES",
        "DETAILED": "RENT_AND_UTILITIES_TELEPHONE",
        "DESCRIPTION": "Cell phone bills"
    },
    {
        "PRIMARY": "RENT_AND_UTILITIES",
        "DETAILED": "RENT_AND_UTILITIES_WATER",
        "DESCRIPTION": "Water bills"
    },
    {
        "PRIMARY": "RENT_AND_UTILITIES",
        "DETAILED": "RENT_AND_UTILITIES_OTHER_UTILITIES",
        "DESCRIPTION": "Other miscellaneous utility bills"
    }
];