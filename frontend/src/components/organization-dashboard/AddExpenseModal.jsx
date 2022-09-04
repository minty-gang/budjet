import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useToast,
	Flex,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { TiBusinessCard } from 'react-icons/ti';
import { useLocation } from 'wouter';
import * as Yup from 'yup';
import api from '../../utils/api';

const validationSchema = Yup.object({
	title: Yup.string().required('Required'),
	description: Yup.string().required('Required'),
	A: Yup.number().required('Required'),
	B: Yup.number(),
	C: Yup.number(),
});

function AddExpenseModal({
	orgID,
	isAddExpenseModalVisible,
	setIsAddExpenseModalVisible,
	setExpenses,
	isEditExpenseModalVisible,
	setIsEditExpenseModalVisible,
	editInitData,
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [location, setLocation] = useLocation();
	const toast = useToast();
	console.log(isEditExpenseModalVisible);
	console.log(setIsEditExpenseModalVisible);
	console.log(editInitData);

	const formik = useFormik({
		initialValues: isAddExpenseModalVisible
			? {
					title: '',
					description: '',
					A: '',
					B: '',
					C: '',
			  }
			: editInitData,
		onSubmit: async (values) => {
			try {
				const budgetID = window.location.pathname.split('/')[4];
				console.log('in2');
				setIsSubmitting(true);
				const parsedValues = {
					...values,
					amount: { A: values.A, B: values.B, C: values.C },
				};
				delete parsedValues.A;
				delete parsedValues.B;
				delete parsedValues.C;
				const res = await api.post(`org/${orgID}/budget/${budgetID}/expense`, parsedValues);
				setIsSubmitting(false);
				setIsAddExpenseModalVisible(false);
				setExpenses((oldValue) => [...oldValue, res]);
			} catch (err) {
				setIsSubmitting(false);
				toast({
					title: 'Error',
					description: err.message,
					status: 'error',
					duration: 9000,
					isClosable: true,
				});
			}
		},
		validationSchema,
	});
	const onClose = () => {
		setIsAddExpenseModalVisible(false);
		setIsEditExpenseModalVisible(false);
		setIsSubmitting(false);
	};

	return (
		<Modal isOpen={isAddExpenseModalVisible || isEditExpenseModalVisible} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create an Expense</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<form onSubmit={formik.handleSubmit}>
						<FormControl mb="1rem">
							<FormLabel>Expense Title</FormLabel>
							<InputGroup>
								<InputLeftElement pointerEvents="none">
									<Icon as={TiBusinessCard} w={7} h={7} />
								</InputLeftElement>
								<Input
									required
									onChange={formik.handleChange}
									value={formik.values.title}
									onBlur={formik.handleBlur}
									name="title"
									placeholder="Enter title of the expense"
								/>
							</InputGroup>
							<FormErrorMessage>{formik.errors.title}</FormErrorMessage>
						</FormControl>
						<FormControl mb="1rem">
							<FormLabel>Expense Description</FormLabel>
							<InputGroup>
								<Textarea
									onChange={formik.handleChange}
									value={formik.values.description}
									onBlur={formik.handleBlur}
									name="description"
									placeholder="Enter description of the expense"
								/>
							</InputGroup>
							<FormErrorMessage>{formik.errors.description}</FormErrorMessage>
						</FormControl>
						<FormControl mb="1rem">
							<FormLabel>
								Amount, according to plan <strong>A</strong>
							</FormLabel>
							<InputGroup>
								<InputLeftElement pointerEvents="none">
									<Icon as={TiBusinessCard} w={7} h={7} />
								</InputLeftElement>
								<Input
									required
									onChange={formik.handleChange}
									value={formik.values.A}
									name="A"
									placeholder="Enter amount of the expense"
								/>
							</InputGroup>
							<FormErrorMessage>{formik.errors.A}</FormErrorMessage>
						</FormControl>
						<FormControl mb="1rem">
							<FormLabel>
								Amount, according to plan <strong>B</strong>
							</FormLabel>
							<InputGroup>
								<InputLeftElement pointerEvents="none">
									<Icon as={TiBusinessCard} w={7} h={7} />
								</InputLeftElement>
								<Input
									onChange={formik.handleChange}
									value={formik.values.B}
									onBlur={formik.handleBlur}
									name="B"
									placeholder="Enter amount of the expense"
								/>
							</InputGroup>
							<FormErrorMessage>{formik.errors.B}</FormErrorMessage>
						</FormControl>
						<FormControl mb="1rem">
							<FormLabel>
								Amount, according to plan <strong>C</strong>
							</FormLabel>
							<InputGroup>
								<InputLeftElement pointerEvents="none">
									<Icon as={TiBusinessCard} w={7} h={7} />
								</InputLeftElement>
								<Input
									onChange={formik.handleChange}
									value={formik.values.C}
									name="C"
									placeholder="Enter amount of the expense"
								/>
							</InputGroup>
							<FormErrorMessage>{formik.errors.C}</FormErrorMessage>
						</FormControl>
						<Flex justify="end">
							<Button
								colorScheme="blue"
								mr={3}
								type="submit"
								onClick={() => {
									console.log('in');
									formik.handleSubmit();
								}}
								isLoading={isSubmitting}
							>
								Create
							</Button>
							<Button variant="ghost" onClick={onClose}>
								Close
							</Button>
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}

export default AddExpenseModal;
