package iitp.infection.pm.band;

public class BandDevices implements Comparable<BandDevices>{
    private String name;
    private String address;
    private int rssi;

    public BandDevices() {
    }

    public BandDevices(String name, String address, int rssi) {
        setName(name);
        setAddress(address);
        setRssi(rssi);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getRssi() {
        return rssi;
    }

    public void setRssi(int rssi) {
        this.rssi = rssi;
    }
    @Override
    public int compareTo(BandDevices bleDevices) {

        return bleDevices.getRssi()-this.getRssi();
    }
}

