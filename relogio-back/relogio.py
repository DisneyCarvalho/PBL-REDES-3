
from time import sleep
from threading import Thread


class relogio():
    def __init__(self, hora) -> None:
        self.hora = hora
        self.drift = 1
        self.tread_drift = Thread(target=self.treadHora, daemon=True).start()


    def sethora(self,hora):
        self.hora = hora

    def setdrift(self,drift):
        self.drift = drift

    def treadHora(self):
        while True:
            self.hora += 1
            sleep(self.drift)
        

if __name__ == '__main__':
    a = relogio(1)
   