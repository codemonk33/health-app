import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch, Modal, ActivityIndicator } from 'react-native';
import { Theme } from './utils/theme';
import Header from './components/Header';
import TrackingStepper, { StepItem } from './components/TrackingStepper';
import EmptyState from './components/EmptyState';
import BottomNavBar from './components/BottomNavBar';
import { medicineService, MedicineItem, CartItem, MedicineOrder, MEDICINE_CATALOG, OrderTrackingStep } from './services/medicineService';
import { useAuth } from './context/AuthContext';

const ORDER_TRACKING_STEPS: StepItem[] = [
  { id: 'placed', title: 'Order Placed & Prescription Uploaded', subtitle: 'Order received by CureAI pharmacy partner' },
  { id: 'verified', title: 'Pharmacist Verified', subtitle: 'Certified pharmacist reviewed dosages' },
  { id: 'packed', title: 'Packed & Dispatched', subtitle: 'Tamper-evident sealed packaging' },
  { id: 'out_for_delivery', title: 'Out for Delivery', subtitle: 'Delivery partner on the way (Express 2-hr)' },
  { id: 'delivered', title: 'Delivered', subtitle: 'Delivered to your doorstep' },
];

export default function OrderMedicineScreen() {
  const { session } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'cart' | 'orders'>('catalog');
  const [medicines] = useState<MedicineItem[]>(() => medicineService.getAvailableMedicines());
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([
    { medicine: MEDICINE_CATALOG[0], quantity: 1, autoRefill: true },
    { medicine: MEDICINE_CATALOG[1], quantity: 1, autoRefill: true }
  ]);
  const [orders, setOrders] = useState<MedicineOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<MedicineOrder | null>(null);

  // Prescription OCR state
  const [isDetectingOcr, setIsDetectingOcr] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);

  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [patientName, setPatientName] = useState(session?.name || 'Ramesh Sharma');
  const [mobile, setMobile] = useState(session?.phone || '9876543210');
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bengaluru');
  const [pincode, setPincode] = useState('560103');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    medicineService.getOrders().then(ords => {
      setOrders(ords);
      if (ords.length > 0) setSelectedOrder(ords[0]);
    });
  }, []);

  const filteredMedicines = useMemo(() => {
    if (!searchQuery.trim()) return medicines;
    const q = searchQuery.toLowerCase();
    return medicines.filter(m => m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q));
  }, [medicines, searchQuery]);

  const addToCart = (med: MedicineItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === med.id);
      if (existing) {
        return prev.map(item => item.medicine.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { medicine: med, quantity: 1, autoRefill: false }];
    });
    Alert.alert('Added to Cart', `${med.name} added to cart.`);
  };

  const updateQuantity = (medId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.medicine.id === medId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const toggleAutoRefill = (medId: string) => {
    setCart(prev => prev.map(item => item.medicine.id === medId ? { ...item, autoRefill: !item.autoRefill } : item));
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.medicine.discountPrice || item.medicine.price) * item.quantity, 0);
  }, [cart]);

  const handleScanPrescription = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to scan prescriptions.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      setPrescriptionImage(uri);
      setIsDetectingOcr(true);

      const ocrResult = await medicineService.detectMedicinesFromPrescription(uri);
      setIsDetectingOcr(false);

      // Add detected medicines to cart
      setCart(prev => {
        const newCart = [...prev];
        ocrResult.detectedMedicines.forEach(det => {
          if (!newCart.some(c => c.medicine.id === det.id)) {
            newCart.push({ medicine: det, quantity: 1, autoRefill: true });
          }
        });
        return newCart;
      });

      setActiveTab('cart');
      Alert.alert(
        'Prescription Analyzed',
        `Detected ${ocrResult.detectedMedicines.length} medicines by ${ocrResult.doctorName || 'Doctor'}. Items added to your cart with automatic refill enabled.`
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (!address || !pincode || !mobile) {
      Alert.alert('Missing Details', 'Please fill address, pincode, and mobile number.');
      return;
    }

    setIsPlacingOrder(true);
    const newOrder = await medicineService.createOrder({
      items: cart,
      totalAmount,
      deliveryAddress: address,
      mobile,
      pincode,
      patientName,
      prescriptionUri: prescriptionImage || undefined,
    });

    setIsPlacingOrder(false);
    setShowCheckoutModal(false);
    setCart([]);
    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    setActiveTab('orders');

    Alert.alert('Order Confirmed!', `Order ID: ${newOrder.id}\nEstimated 2-hour delivery to ${pincode}`);
  };

  const getStepIndex = (step: OrderTrackingStep) => {
    const orderMap: Record<OrderTrackingStep, number> = {
      placed: 0,
      verified: 1,
      packed: 2,
      out_for_delivery: 3,
      delivered: 4,
    };
    return orderMap[step] ?? 0;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Order Medicine"
        subtitle="2-Hour Express Delivery & Prescription Refills"
        rightAction={{
          icon: 'cart',
          onPress: () => setActiveTab('cart'),
          color: Theme.colors.warning,
        }}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'catalog' && styles.tabButtonActive]}
          onPress={() => setActiveTab('catalog')}
        >
          <Text style={[styles.tabText, activeTab === 'catalog' && styles.tabTextActive]}>
            Medicines ({medicines.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'cart' && styles.tabButtonActive]}
          onPress={() => setActiveTab('cart')}
        >
          <Text style={[styles.tabText, activeTab === 'cart' && styles.tabTextActive]}>
            Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'orders' && styles.tabButtonActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            Orders & Track ({orders.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <View>
            {/* Scan Prescription Banner */}
            <TouchableOpacity
              style={styles.scanBanner}
              onPress={handleScanPrescription}
              activeOpacity={0.85}
              disabled={isDetectingOcr}
            >
              <View style={styles.scanIconBox}>
                {isDetectingOcr ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Ionicons name="camera" size={24} color="#ffffff" />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.scanBannerTitle}>
                  {isDetectingOcr ? 'Analyzing Prescription with NEX-AI...' : "Scan Doctor's Prescription"}
                </Text>
                <Text style={styles.scanBannerSubtitle}>
                  {isDetectingOcr
                    ? 'Extracting medicines, dosages and matching catalog...'
                    : 'NEX-AI automatically extracts medicines, sets up refills & orders'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Theme.colors.warning} />
            </TouchableOpacity>

            {/* Search Input */}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color={Theme.colors.neutralSecondaryText} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search medicines, salt name, generics..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#95a5a6"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={Theme.colors.neutralSecondaryText} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Medicine Items List */}
            {filteredMedicines.map(med => (
              <View key={med.id} style={styles.medicineCard}>
                <View style={styles.medLeft}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medGeneric}>{med.genericName} • {med.packSize}</Text>
                  <Text style={styles.medManufacturer}>{med.manufacturer}</Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.discountPrice}>₹{med.discountPrice || med.price}</Text>
                    {med.discountPrice && (
                      <Text style={styles.mrpPrice}>MRP ₹{med.price}</Text>
                    )}
                    {med.requiresPrescription && (
                      <View style={styles.rxBadge}>
                        <Text style={styles.rxText}>Rx Required</Text>
                      </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => addToCart(med)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addBtnText}>+ ADD</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <View>
            {cart.length === 0 ? (
              <EmptyState
                icon="cart-outline"
                title="Your Medicine Cart is Empty"
                description="Scan a prescription or choose from commonly prescribed chronic medications."
                actionText="Browse Medicines"
                onActionPress={() => setActiveTab('catalog')}
              />
            ) : (
              <View>
                {/* Cart Items */}
                {cart.map(item => (
                  <View key={item.medicine.id} style={styles.cartCard}>
                    <View style={styles.cartCardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cartMedTitle}>{item.medicine.name}</Text>
                        <Text style={styles.cartMedPrice}>₹{item.medicine.discountPrice || item.medicine.price} per pack</Text>
                      </View>

                      {/* Quantity Stepper */}
                      <View style={styles.qtyStepper}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.medicine.id, -1)}
                        >
                          <Ionicons name="remove" size={16} color={Theme.colors.neutralText} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.medicine.id, 1)}
                        >
                          <Ionicons name="add" size={16} color={Theme.colors.neutralText} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Auto Refill Toggle */}
                    <View style={styles.refillRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="repeat" size={18} color="#8e44ad" style={{ marginRight: 6 }} />
                        <Text style={styles.refillText}>Monthly Auto-Refill (Elder Care)</Text>
                      </View>
                      <Switch
                        value={item.autoRefill}
                        onValueChange={() => toggleAutoRefill(item.medicine.id)}
                        trackColor={{ false: '#767577', true: '#8e44ad' }}
                      />
                    </View>
                  </View>
                ))}

                {/* Price Breakdown */}
                <View style={styles.billCard}>
                  <Text style={styles.billTitle}>Bill Summary</Text>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Item Total</Text>
                    <Text style={styles.billValue}>₹{totalAmount}</Text>
                  </View>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Express 2-Hr Delivery</Text>
                    <Text style={[styles.billValue, { color: '#10b981' }]}>FREE (Senior Plan)</Text>
                  </View>
                  <View style={[styles.billRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>To Pay</Text>
                    <Text style={styles.totalValue}>₹{totalAmount}</Text>
                  </View>
                </View>

                {/* Checkout CTA */}
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => setShowCheckoutModal(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.checkoutBtnText}>Proceed to Delivery Details (₹{totalAmount})</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Orders & Tracking Tab */}
        {activeTab === 'orders' && (
          <View>
            {orders.length === 0 ? (
              <EmptyState
                icon="cube-outline"
                title="No Active Orders"
                description="Orders placed for home delivery will appear here with live tracking."
                actionText="Order Medicines"
                onActionPress={() => setActiveTab('catalog')}
              />
            ) : (
              orders.map(order => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <TouchableOpacity
                    key={order.id}
                    style={[styles.orderCard, isSelected && { borderColor: Theme.colors.primary, borderWidth: 2 }]}
                    onPress={() => setSelectedOrder(isSelected ? null : order)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.orderHeader}>
                      <View>
                        <Text style={styles.orderIdText}>Order #{order.id}</Text>
                        <Text style={styles.orderDateText}>Placed on {order.orderDate} • {order.estimatedDelivery}</Text>
                      </View>
                      <View style={styles.orderStatusBadge}>
                        <Text style={styles.orderStatusText}>{order.status.toUpperCase()}</Text>
                      </View>
                    </View>

                    {/* Tracking Stepper */}
                    <View style={styles.trackingContainer}>
                      <Text style={styles.trackingHeading}>Live Dispatch Tracking</Text>
                      <TrackingStepper
                        steps={ORDER_TRACKING_STEPS}
                        currentStepIndex={getStepIndex(order.trackingStep)}
                      />
                    </View>

                    {/* Order Items */}
                    <View style={styles.orderItemsBox}>
                      <Text style={styles.itemsSummaryTitle}>Prescription Medicines (Total ₹{order.totalAmount}):</Text>
                      {order.items.map((it, idx) => (
                        <Text key={idx} style={styles.itemSummaryLine}>
                          • {it.quantity}x {it.medicine.name} {it.autoRefill ? '(Auto-Refill On)' : ''}
                        </Text>
                      ))}
                      <Text style={styles.orderAddressText}>📍 Delivering to: {order.deliveryAddress}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Checkout Modal */}
      <Modal
        visible={showCheckoutModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCheckoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Delivery Address</Text>
              <TouchableOpacity onPress={() => setShowCheckoutModal(false)}>
                <Ionicons name="close" size={24} color={Theme.colors.neutralText} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Patient Name</Text>
            <TextInput style={styles.modalInput} value={patientName} onChangeText={setPatientName} />

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput style={styles.modalInput} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

            <Text style={styles.inputLabel}>Delivery Address</Text>
            <TextInput
              style={[styles.modalInput, { height: 60 }]}
              value={address}
              onChangeText={setAddress}
              multiline
            />

            <Text style={styles.inputLabel}>Pincode</Text>
            <TextInput style={styles.modalInput} value={pincode} onChangeText={setPincode} keyboardType="number-pad" />

            <TouchableOpacity
              style={styles.confirmOrderBtn}
              onPress={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.confirmOrderText}>Confirm & Place Order (₹{totalAmount})</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FEF5E7',
  },
  tabText: {
    fontWeight: '600',
    color: Theme.colors.neutralSecondaryText,
    fontSize: 13,
  },
  tabTextActive: {
    color: Theme.colors.warning,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  scanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    borderWidth: 1,
    borderColor: '#F9E79F',
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
  },
  scanIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7D6608',
  },
  scanBannerSubtitle: {
    fontSize: 12,
    color: '#9A7D0A',
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.rounding.medium,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Theme.colors.neutralText,
    marginLeft: 8,
  },
  medicineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: Theme.rounding.large,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  medLeft: {
    flex: 1,
  },
  medName: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 2,
  },
  medGeneric: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 2,
  },
  medManufacturer: {
    fontSize: 11,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.neutralText,
  },
  mrpPrice: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    textDecorationLine: 'line-through',
  },
  rxBadge: {
    backgroundColor: '#FDEDEC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rxText: {
    color: Theme.colors.danger,
    fontSize: 10,
    fontWeight: '700',
  },
  addBtn: {
    backgroundColor: '#FEF5E7',
    borderWidth: 1,
    borderColor: Theme.colors.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Theme.rounding.medium,
  },
  addBtnText: {
    color: Theme.colors.warning,
    fontWeight: '700',
    fontSize: 13,
  },
  cartCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cartCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartMedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  cartMedPrice: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    paddingHorizontal: 10,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  refillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  refillText: {
    fontSize: 13,
    color: '#6B21A8',
    fontWeight: '600',
  },
  billCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: Theme.colors.neutralSecondaryText,
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.neutralText,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.neutralText,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary,
    height: 54,
    borderRadius: Theme.rounding.large,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.button,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  orderCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.rounding.large,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  orderDateText: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 2,
  },
  orderStatusBadge: {
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderStatusText: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 11,
  },
  trackingContainer: {
    backgroundColor: '#FAFBFD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  trackingHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 10,
  },
  orderItemsBox: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  itemsSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.neutralText,
    marginBottom: 4,
  },
  itemSummaryLine: {
    fontSize: 13,
    color: Theme.colors.neutralSecondaryText,
    marginBottom: 2,
  },
  orderAddressText: {
    fontSize: 12,
    color: Theme.colors.neutralSecondaryText,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.neutralText,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.neutralText,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  confirmOrderBtn: {
    backgroundColor: Theme.colors.primary,
    height: 52,
    borderRadius: Theme.rounding.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  confirmOrderText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
