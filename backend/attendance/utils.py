from .models import Attendance

def calculate_stats(records):
    present = records.filter(status=Attendance.Status.PRESENT).count()
    absent = records.filter(status=Attendance.Status.ABSENT).count()

    total = present + absent
    #if percentage > 0 then give percentage value if not give 0
    percentage = round((present / total) * 100, 2) if total > 0 else 0

    return {
        "present": present,
        "absent": absent,
        "total": total,
        "percentage": percentage,
    }
