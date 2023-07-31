import CholesterolSensor from "./sensors/cholesterolSensor";

class IoT {
  constructor() {
    this.sensor = new CholesterolSensor();
    this.warnings = [];
    this.date = new Date();
  }

  getDate({ utsPlusHours }) {
    var currentDate = new Date();
    var timeZoneOffset = utsPlusHours;
    var offsetMilliseconds = timeZoneOffset * 60 * 1000;
    var newDate = new Date(currentDate.getTime() + offsetMilliseconds);
    this.date = newDate;
  }

  runMeasurements({
    totalCholesterolMin,
    totalCholesterolMax,
    hdlCholesterolMin,
    hdlCholesterolMax,
    vldlCholesterolMin,
    vldlCholesterolMax,
    ldlCholesterolMin,
    ldlCholesterolMax,
  }) {
    this.getDate({ utsPlusHours: (new Date()).getTimezoneOffset() * - 1 });
    this.sensor.getMeasurements();
    this.checkWarnings({
      totalCholesterolMin,
      totalCholesterolMax,
      hdlCholesterolMin,
      hdlCholesterolMax,
      vldlCholesterolMin,
      vldlCholesterolMax,
      ldlCholesterolMin,
      ldlCholesterolMax,
    });
  }

  checkWarnings({
    totalCholesterolMin,
    totalCholesterolMax,
    hdlCholesterolMin,
    hdlCholesterolMax,
    vldlCholesterolMin,
    vldlCholesterolMax,
    ldlCholesterolMin,
    ldlCholesterolMax,
  }) {
    this.warnings = [];

    if (this.sensor.totalCholesterol < totalCholesterolMin) {
      this.warnings.push({
        description: {
          en: "Low total cholesterol",
          uk: "Низький загальний холестерин",
        },
      });
    } else if (this.sensor.totalCholesterol > totalCholesterolMax) {
      this.warnings.push({
        description: {
          en: "High total cholesterol",
          uk: "Високий загальний холестерин",
        },
      });
    }

    if (this.sensor.hdlCholesterol < hdlCholesterolMin) {
      this.warnings.push({
        description: {
          en: "Low HDL cholesterol",
          uk: "Низький рівень холестерину ЛПВЩ",
        },
      });
    } else if (this.sensor.hdlCholesterol > hdlCholesterolMax) {
      this.warnings.push({
        description: {
          en: "High HDL cholesterol",
          uk: "Високий рівень холестерину ЛПВЩ",
        },
      });
    }

    if (this.sensor.vldlCholesterol < vldlCholesterolMin) {
      this.warnings.push({
        description: {
          en: "Low VLDL cholesterol",
          uk: "Низький рівень холестерину ЛПДНЩ",
        },
      });
    } else if (this.sensor.vldlCholesterol > vldlCholesterolMax) {
      this.warnings.push({
        description: {
          en: "High VLDL cholesterol",
          uk: "Високий рівень холестерину ЛПДНЩ",
        },
      });
    }

    if (this.sensor.ldlCholesterol < ldlCholesterolMin) {
      this.warnings.push({
        description: {
          en: "Low LDL cholesterol",
          uk: "Низький рівень холестерину ЛПНЩ",
        },
      });
    } else if (this.sensor.ldlCholesterol > ldlCholesterolMax) {
      this.warnings.push({
        description: {
          en: "High LDL cholesterol",
          uk: "Високий рівень холестерину ЛПНЩ",
        },
      });
    }
  }
}

export default IoT;
