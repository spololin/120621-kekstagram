function getMessage(a, b) {
  if (typeof(a) === "boolean") {
    if (a) {
      return "���������� GIF-����������� ����������� � �������� " + b + " ������";
    }
    else {
      return "���������� GIF-����������� �� �����������";
    }
  };
  if (typeof(a) === "number") {
    return "���������� SVG-����������� �������� " + a + " �������� � " + b * 4 + " ����������";
  };
  if (typeof(a) === "object") {
    var sum = 0;
    for (var i = 0; i < a.length; i++) {
      sum += a[i];
    }
    return "���������� ������� ����� �� ���� �������� �����������: " + sum;
  };
  if (typeof(a) === "object" && typeof(b) === "object") {
    var square = 0;
    for (i = 0; i < a.length; i++) {
      square += a[i] * b[i];
    }
    return "����� ������� ���������� ������:" + square + "��������";
  };
}