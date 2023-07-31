class CholesterolSensor {
    constructor() {
      this.totalCholesterol = 0;
      this.hdlCholesterol = 0;
      this.vldlCholesterol = 0;
      this.ldlCholesterol = 0;
    }
  
    getMeasurements() {
      this.totalCholesterol = getRandomMeasurement(5, 6.8);
      this.hdlCholesterol = getRandomMeasurement(0.7, 1.2);
      this.vldlCholesterol = getRandomMeasurement(1.8, 2.7);
      this.ldlCholesterol = getRandomMeasurement(3.2, 4.8);
    }
  }
  
  function getRandomMeasurement(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }
  
  
export default CholesterolSensor;