# import os
# import django

# # Setup Django environment
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sampleProject.settings')
# django.setup()

# # Import all models from jsw.models
# from jsw.models import (
#     user, employee_details, Dashboard, vitals, mockdrills, eventsandcamps,
#     heamatalogy, RoutineSugarTests, RenalFunctionTest, LipidProfile,
#     LiverFunctionTest, ThyroidFunctionTest, AutoimmuneTest, CoagulationTest,
#     EnzymesCardiacProfile, UrineRoutineTest, SerologyTest, MotionTest,
#     CultureSensitivityTest, MensPack, WomensPack, OccupationalProfile,
#     OthersTest, OphthalmicReport, XRay, USGReport, CTReport, MRIReport,
#     Appointment, FitnessAssessment, VaccinationRecord, ReviewCategory, Review,
#     Member, MedicalHistory, Consultation, PharmacyStock, ExpiryRegister,
#     DiscardedMedicine, WardConsumables, AmbulanceConsumables, PharmacyMedicine,
#     InstrumentCalibration, Prescription, Form17, Form38, Form39, Form40, Form27,
#     SignificantNotes, PharmacyStockHistory, DailyQuantity
# )

# from django.db import transaction

# # Function to transfer data for a single model
# def transfer_model_data(model):
#     objs = list(model.objects.using('mysql').all())
#     for obj in objs:
#         obj.pk = None  # Reset primary key to allow insertion as new record
#     with transaction.atomic(using='default'):
#         model.objects.using('default').bulk_create(objs, batch_size=500)

# # Main function
# def main():
#     print("\n🚀 Starting MySQL → MSSQL Data Transfer...\n")

#     # List of all models to transfer
#     model_list = [
#         user, employee_details, Dashboard, vitals, mockdrills, eventsandcamps,
#         heamatalogy, RoutineSugarTests, RenalFunctionTest, LipidProfile,
#         LiverFunctionTest, ThyroidFunctionTest, AutoimmuneTest, CoagulationTest,
#         EnzymesCardiacProfile, UrineRoutineTest, SerologyTest, MotionTest,
#         CultureSensitivityTest, MensPack, WomensPack, OccupationalProfile,
#         OthersTest, OphthalmicReport, XRay, USGReport, CTReport, MRIReport,
#         Appointment, FitnessAssessment, VaccinationRecord, ReviewCategory, Review,
#         Member, MedicalHistory, Consultation, PharmacyStock, ExpiryRegister,
#         DiscardedMedicine, WardConsumables, AmbulanceConsumables, PharmacyMedicine,
#         InstrumentCalibration, Prescription, Form17, Form38, Form39, Form40, Form27,
#         SignificantNotes, PharmacyStockHistory, DailyQuantity
#     ]

#     for model in model_list:
#         model_name = model.__name__
#         print(f"🔄 Transferring: {model_name}")
#         try:
#             transfer_model_data(model)
#             print(f"✅ Done: {model_name}\n")
#         except Exception as e:
#             print(f"❌ Error in {model_name}: {str(e)}\n")

#     print("\n✅ All transfers complete.\n")

# if __name__ == "__main__":
#     main()
import pymssql

def run_custom_query(query):
    try:
        conn = pymssql.connect(server='1.1.1.1', user='sa', password='j$w@dm!n123', database='OHC_JSW')
        cursor = conn.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        conn.close()
        return result
    except Exception as e:
        print("DB connection error:", e)
        return None
